import amqp, { Channel, Connection, ConsumeMessage } from 'amqplib';
import { createEntityInDatabase, updateEntityInDatabase, deleteEntityFromDatabase } from '../rabbitMQ/handleCRUDOperation';

/**
 * RabbitMQService class to manage interactions with RabbitMQ.
 */
class RabbitMQService {
  private connectionURL: string;
  private models: any;
  private connection: Connection | null;
  private channel: Channel | null;
  private logger: any;
  private exchangeDurable: boolean;
  private queueDurable: boolean;
  private ack: boolean;

  /**
   * Constructor to initialize RabbitMQService.
   * @param {string} connectionURL - URL of the RabbitMQ server.
   * @param {Object} models - Database models.
   * @param {any} [logger=null] - Logger for logging purposes.
   * @param {boolean} [durable=true] - Whether exchanges and queues are durable.
   */
  constructor(connectionURL: string, models: any, logger: any = null, durable: boolean = true) {
    this.connectionURL = connectionURL;
    this.models = models;
    this.connection = null;
    this.channel = null;
    this.logger = logger;
    this.exchangeDurable = durable;
    this.queueDurable = durable;
    this.ack = true; // Acknowledge messages by default to prevent message loss in case of error
  }

  /**
   * Connects to RabbitMQ server.
   */
  async connect(): Promise<void> {
    try {
      this.connection = await amqp.connect(this.connectionURL);
      this.channel = await this.connection.createChannel();
      console.log('Connected to RabbitMQ');
    } catch (error) {
      console.error('Failed to connect to RabbitMQ:', error);
    }
  }

  /**
   * Closes the RabbitMQ connection.
   */
  async close(): Promise<void> {
    if (this.channel) await this.channel.close();
    if (this.connection) await this.connection.close();
  }

  /**
   * Subscribes to a topic and processes messages using the specified operation.
   * @param {string} exchangeTopic - The topic exchange to subscribe to.
   * @param {string} routingKey - Routing key for the exchange.
   * @param {string} queueName - Name of the queue.
   * @param {string} entityName - Name of the entity being handled.
   * @param {string} operation - Operation type (created, updated, deleted).
   * @param {Function} handleCallback - Callback function to handle custom events.
   * @param {any} data - Data for handling the event (optional).
   * @param {Function} callback - Custom callback function (optional).
   */
  async subscribeTopic(
    exchangeTopic: string,
    routingKey: string,
    queueName: string,
    entityName: string,
    operation: 'created' | 'updated' | 'deleted',
  ): Promise<void> {
    if (!this.channel) {
      console.error('Channel not initialized. Please connect first.');
      return;
    }

    await this.channel.assertExchange(exchangeTopic, 'topic', { durable: this.exchangeDurable });
    await this.channel.assertQueue(queueName, { durable: this.queueDurable });
    await this.channel.bindQueue(queueName, exchangeTopic, routingKey);

    console.log(`[*] Subscribing to topic exchange ${exchangeTopic} with queue ${queueName}`);

    this.channel.consume(queueName, async (receivedMsg: ConsumeMessage | null) => {
      if (receivedMsg) {
        const messageData = JSON.parse(receivedMsg.content.toString());
        try {
          console.log(`Processing message with routingKey: ${routingKey} and messageData:`, messageData);

          const parsedData = JSON.parse(messageData.data);
          let idField: string, model: any;

          if (entityName && this.models[entityName]) {
            idField = entityName.charAt(0).toLowerCase() + entityName.slice(1) + 'ID';
            model = this.models[entityName];

            switch (operation) {
              case 'created':
                await createEntityInDatabase(model, parsedData, parsedData[idField]);
                break;
              case 'updated':
                await updateEntityInDatabase(model, parsedData, parsedData[idField]);
                break;
              case 'deleted':
                await deleteEntityFromDatabase(model, parsedData[idField]);
                break;
              default:
                throw new Error('Invalid operation');
            }

            console.log(`Processed message for ${entityName} with operation ${operation}:`, messageData);
            this.channel!.ack(receivedMsg);
          }
        } catch (error) {
          console.error(`Error processing message for ${entityName}: ${error}`);
          this.channel!.nack(receivedMsg, false, false);

          if (this.logger) {
            this.logger.error(`Error processing message for ${entityName}: ${error}`);
          } else {
            console.error(`Error processing message for ${entityName}: ${error}`);
          }
        }
      }
    }, { noAck: false });
  }

  /**
   * Publishes a message to a RabbitMQ topic.
   * @param {string} exchangeTopic - Name of the topic exchange.
   * @param {string} routingKey - Routing key for the exchange.
   * @param {Object} message - Message to publish.
   * @param {Object} [context={}] - Context of the message.
   * @param {Object} [options={}] - Additional options for publishing.
   */
  async publishTopic(
    exchangeTopic: string,
    routingKey: string,
    message: object,
    context: object = {},
    options: object = {}
  ): Promise<void> {
    if (!this.channel) {
      console.error('Channel not initialized. Please connect first.');
      return;
    }

    const messageWithContext = {
      context: context,
      data: message,
    };

    const messageBuffer = Buffer.from(JSON.stringify(messageWithContext));

    await this.channel.assertExchange(exchangeTopic, 'topic', { durable: (options as any).durable ?? this.exchangeDurable });
    this.channel.publish(exchangeTopic, routingKey, messageBuffer, options);
  }

  /**
   * Prepares to publish a message to a RabbitMQ topic by connecting, publishing, and closing the connection.
   * @param {string} exchangeTopic - Name of the topic exchange.
   * @param {string} routingKey - Routing key for the exchange.
   * @param {Object} message - Message to publish.
   * @param {Object} [context={}] - Context of the message.
   * @param {Object} [options={}] - Additional options for publishing.
   */
  async readyToPublishTopic(
    exchangeTopic: string,
    routingKey: string,
    message: object,
    context: object = {},
    options: object = {}
  ): Promise<void> {
    await this.connect();
    await this.publishTopic(exchangeTopic, routingKey, message, context, options);
    await this.close();
  }

  /**
   * Starts consumers for the specified microservices.
   * @param {Object} microservices - The configuration of microservices and their operations (muConsumers in the microservice).
   */
  async startConsumers(microservices: any): Promise<void> {
    const µservice = process.env.MST_SERVICE_NAME;

    await this.connect();
    for (const [microserviceName, config] of Object.entries(microservices)) {
      for (const [entityName, entityConfig] of Object.entries(config as any)) {
        const { operations } = entityConfig as { operations: string[] };
        const exchangeName = `${microserviceName}.events`;

        for (const operation of operations) {
          const queueName = `${entityName}-${operation}-${µservice}-queue`;
          const routingKey = `${entityName}.${operation}`;

          console.log(`Preparing to subscribe to queue ${queueName} ...`);

          await this.subscribeTopic(exchangeName, routingKey, queueName, entityName as string, operation as 'created' | 'updated' | 'deleted');
        }
      }
    }
    console.log("All consumers have been set up for all microservices.");
  }
}

export { RabbitMQService };

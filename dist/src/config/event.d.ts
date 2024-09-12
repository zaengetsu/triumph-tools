/**
 * RabbitMQService class to manage interactions with RabbitMQ.
 */
declare class RabbitMQService {
    private connectionURL;
    private models;
    private connection;
    private channel;
    private logger;
    private exchangeDurable;
    private queueDurable;
    private ack;
    /**
     * Constructor to initialize RabbitMQService.
     * @param {string} connectionURL - URL of the RabbitMQ server.
     * @param {Object} models - Database models.
     * @param {any} [logger=null] - Logger for logging purposes.
     * @param {boolean} [durable=true] - Whether exchanges and queues are durable.
     */
    constructor(connectionURL: string, models: any, logger?: any, durable?: boolean);
    /**
     * Connects to RabbitMQ server.
     */
    connect(): Promise<void>;
    /**
     * Closes the RabbitMQ connection.
     */
    close(): Promise<void>;
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
    subscribeTopic(exchangeTopic: string, routingKey: string, queueName: string, entityName: string, operation: 'created' | 'updated' | 'deleted'): Promise<void>;
    /**
     * Publishes a message to a RabbitMQ topic.
     * @param {string} exchangeTopic - Name of the topic exchange.
     * @param {string} routingKey - Routing key for the exchange.
     * @param {Object} message - Message to publish.
     * @param {Object} [context={}] - Context of the message.
     * @param {Object} [options={}] - Additional options for publishing.
     */
    publishTopic(exchangeTopic: string, routingKey: string, message: object, context?: object, options?: object): Promise<void>;
    /**
     * Prepares to publish a message to a RabbitMQ topic by connecting, publishing, and closing the connection.
     * @param {string} exchangeTopic - Name of the topic exchange.
     * @param {string} routingKey - Routing key for the exchange.
     * @param {Object} message - Message to publish.
     * @param {Object} [context={}] - Context of the message.
     * @param {Object} [options={}] - Additional options for publishing.
     */
    readyToPublishTopic(exchangeTopic: string, routingKey: string, message: object, context?: object, options?: object): Promise<void>;
    /**
     * Starts consumers for the specified microservices.
     * @param {Object} microservices - The configuration of microservices and their operations (muConsumers in the microservice).
     */
    startConsumers(microservices: any): Promise<void>;
}
export { RabbitMQService };

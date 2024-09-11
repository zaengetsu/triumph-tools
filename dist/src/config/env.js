import fs from 'fs';
import path from 'path';
// Fonction pour lire les secrets des fichiers secret ;-)
const readSecret = (filename, defaultValue = '') => {
    try {
        const secretPath = process.env.MST_SECRETS_FOLDER || '../run/secrets/';
        const fullPath = path.resolve(`${secretPath}${filename}`);
        return fs.existsSync(fullPath) ? fs.readFileSync(fullPath, 'utf-8').trim() : defaultValue;
    }
    catch (error) {
        console.error(`Erreur lors de la lecture du fichier secret ${filename}: `, error);
        return defaultValue;
    }
};
const dbConfig = {
    dialect: process.env.DB_DIALECT || 'postgres',
    host: process.env.DB_HOST || readSecret('auth_db_host', 'localhost'),
    port: parseInt(`${process.env.DB_PORT || readSecret('auth_db_port', '5432')}`, 10),
    user: process.env.DB_USERNAME || readSecret('auth_db_username', 'default_user'),
    password: process.env.DB_PASSWORD || readSecret('auth_db_pswd', 'default_password'),
    name: process.env.DB_DATABASE || readSecret('auth_db_name', 'default_db'),
    schema: process.env.DB_SCHEMA || 'public',
};
console.log('DB Config :', dbConfig);
const rabbitMQConfig = {
    user: process.env.RABBITMQ_USER || 'guest',
    password: process.env.RABBITMQ_PSWD || 'guest',
    host: process.env.RABBITMQ_HOST || 'localhost',
    port: parseInt(`${process.env.RABBITMQ_PORT || '5672'}`, 10),
    vhost: process.env.RABBITMQ_VHOST || '/',
    exchangeType: process.env.RABBITMQ_EXCHANGE_TYPE || 'topic',
    queue: process.env.RABBITMQ_QUEUE || 'mst_main_queue',
    routingKey: process.env.RABBITMQ_ROUTING_KEY || 'services_data_backend_key',
    url: process.env.RABBITMQ_URL || `amqp://${process.env.RABBITMQ_USER}:${process.env.RABBITMQ_PSWD}@${process.env.RABBITMQ_HOST}:${process.env.RABBITMQ_PORT}/`,
    exchange: process.env.RABBITMQ_EXCHANGE || 'authentication.events',
};
console.log('RabbitMQ Config :', rabbitMQConfig);
const appConfig = {
    serviceName: process.env.MICROSERVICE_NAME || 'authentication',
    serviceShortName: process.env.MICROSERVICE_QUADRANAME || 'auth',
    apiPort: parseInt(process.env.MST_PORT || '4001', 10),
    nodeTlsRejectUnauthorized: process.env.NODE_TLS_REJECT_UNAUTHORIZED === '0' ? false : true,
};
const envConfig = {
    dbConfig,
    rabbitMQConfig,
    appConfig,
    processEnv: process.env,
};
console.log('Configuration environnement :', envConfig);
export { dbConfig, rabbitMQConfig, appConfig, envConfig };

import fs from 'fs';
import path from 'path';

// Fonction pour lire les secrets à partir d'un fichier
const readSecret = (filename, defaultValue = '') => {
    try {
        const fullPath = path.resolve(filename);
        return fs.existsSync(fullPath) ? fs.readFileSync(fullPath, 'utf-8').trim() : defaultValue;
    } catch (error) {
        console.error(`Erreur lors de la lecture du fichier secret ${filename}: `, error);
        return defaultValue;
    }
};

// Fonction pour lire une variable d'environnement ou un fichier secret
const getEnvOrSecret = (envVar, defaultValue) => {
    const value = process.env[envVar];

    // Si la variable d'environnement contient un chemin de fichier, lire le fichier
    if (value && value.startsWith('../')) {
        console.log(`Lecture du secret à partir du chemin : ${value}`);
        return readSecret(value, defaultValue);
    }

    // Sinon, retourner la valeur de la variable d'environnement ou une valeur par défaut
    return value || defaultValue;
};

// Configurations
const dbConfig = {
    dialect: process.env.DB_DIALECT || 'postgres',
    host: process.env.DATABASE_DB_FILE || 'localhost',
    port: parseInt(process.env.DB_PORT || '5432', 10),
    user: getEnvOrSecret('DB_USERNAME', 'default_user'),
    password: getEnvOrSecret('DB_PASSWORD', 'default_password'),
    name: getEnvOrSecret('DB_DATABASE', 'default_db'),
    schema: process.env.DB_SCHEMA || 'public',
};

const rabbitMQConfig = {
    user: process.env.RABBITMQ_USER || 'guest',
    password: process.env.RABBITMQ_PSWD || 'guest',
    host: process.env.RABBITMQ_HOST || 'localhost',
    port: parseInt(process.env.RABBITMQ_PORT || '5672', 10),
    vhost: process.env.RABBITMQ_VHOST || '/',
    exchangeType: process.env.RABBITMQ_EXCHANGE_TYPE || 'topic',
    queue: process.env.RABBITMQ_QUEUE || 'mst_main_queue',
    routingKey: process.env.RABBITMQ_ROUTING_KEY || 'triumph_data_backend_key',
    url: process.env.RABBITMQ_URL || `amqp://${process.env.RABBITMQ_USER}:${process.env.RABBITMQ_PSWD}@${process.env.RABBITMQ_HOST}:${process.env.RABBITMQ_PORT}/`,
    exchange: process.env.RABBITMQ_EXCHANGE || 'authentication.events',
};

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
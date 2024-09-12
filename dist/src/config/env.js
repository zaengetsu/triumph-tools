import fs from 'fs';
import path from 'path';
// Fonction pour lire les secrets à partir des fichiers
const readSecret = (filename, defaultValue = '') => {
    try {
        const secretPath = process.env.MST_SECRETS_FOLDER || '../run_mst/secrets/';
        const fullPath = path.resolve(`${secretPath}${filename}`);
        console.log(`Lecture du fichier secret à partir du chemin : ${fullPath}`);
        if (fs.existsSync(fullPath)) {
            console.log(`Fichier trouvé : ${fullPath}`);
            return fs.readFileSync(fullPath, 'utf-8').trim();
        }
        else {
            console.log(`Fichier non trouvé : ${fullPath}, utilisation de la valeur par défaut.`);
            return defaultValue;
        }
    }
    catch (error) {
        console.error(`Erreur lors de la lecture du fichier secret ${filename}: `, error);
        return defaultValue;
    }
};
// Récupérer la variable d'environnement ou lire un fichier de secret
const getEnvOrSecret = (envVar, secretFile, defaultValue) => {
    const value = process.env[envVar];
    if (value && value.startsWith('../')) {
        return readSecret(secretFile, defaultValue);
    }
    return value || defaultValue;
};
// Configuration de la base de données
const dbConfig = {
    dialect: process.env.DB_DIALECT || 'postgres',
    host: getEnvOrSecret('DB_HOST', 'auth_db_host', 'localhost'),
    port: parseInt(process.env.DB_PORT || readSecret('auth_db_port', '5432'), 10),
    user: getEnvOrSecret('DB_USERNAME', 'auth_db_username', 'default_user'),
    password: getEnvOrSecret('DB_PASSWORD', 'auth_db_pswd', 'default_password'),
    name: getEnvOrSecret('DB_DATABASE', 'auth_db_name', 'default_db'),
    schema: process.env.DB_SCHEMA || 'public',
};
// Configuration de RabbitMQ
const rabbitMQConfig = {
    user: process.env.RABBITMQ_USER || 'guest',
    password: process.env.RABBITMQ_PSWD || 'guest',
    host: process.env.RABBITMQ_HOST || 'localhost',
    port: parseInt(process.env.RABBITMQ_PORT || '5672', 10),
    vhost: process.env.RABBITMQ_VHOST || '/',
    exchangeType: process.env.RABBITMQ_EXCHANGE_TYPE || 'topic',
    queue: process.env.RABBITMQ_QUEUE || 'mst_main_queue',
    routingKey: process.env.RABBITMQ_ROUTING_KEY || 'mst_data_backend_key',
    url: process.env.RABBITMQ_URL || `amqp://${process.env.RABBITMQ_USER}:${process.env.RABBITMQ_PSWD}@${process.env.RABBITMQ_HOST}:${process.env.RABBITMQ_PORT}/`,
    exchange: process.env.RABBITMQ_EXCHANGE || 'authentication.events',
};
// Configuration de l'application
const appConfig = {
    serviceName: process.env.MICROSERVICE_NAME || 'authentication',
    serviceShortName: process.env.MICROSERVICE_QUADRANAME || 'auth',
    apiPort: parseInt(process.env.MST_PORT || '4001', 10),
    nodeTlsRejectUnauthorized: process.env.NODE_TLS_REJECT_UNAUTHORIZED === '0' ? false : true,
};
// Configuration globale de l'environnement
const envConfig = {
    dbConfig,
    rabbitMQConfig,
    appConfig,
};
console.log('Configuration environnement :', envConfig);
export { dbConfig, rabbitMQConfig, appConfig, envConfig };

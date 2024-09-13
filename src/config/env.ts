import fs from 'fs';
import path from 'path';

interface DBConfig {
  dialect: string;
  host: string;
  port: number;
  user: string;
  password: string;
  name: string;
  schema: string;
}

// Interface pour la configuration de RabbitMQ
interface RabbitMQConfig {
  user: string;
  password: string;
  host: string;
  port: number;
  vhost: string;
  exchangeType: string;
  queue: string;
  routingKey: string;
  url: string;
  exchange: string;
}

// Interface pour la configuration de l'application
interface AppConfig {
  serviceName: string;
  serviceShortName: string;
  apiPort: number;
  nodeTlsRejectUnauthorized: boolean;
}

// Fonction pour lire les secrets à partir des fichiers
const readSecret = (filePath: string, defaultValue: string = ''): string => {
  try {
    const fullPath = path.resolve(filePath);

    if (fs.existsSync(fullPath)) {
      return fs.readFileSync(fullPath, 'utf-8').trim();
    } else {
      console.log(`Fichier non trouvé : ${fullPath}, utilisation de la valeur par défaut.`);
      return defaultValue;
    }
  } catch (error) {
    console.error(`Erreur lors de la lecture du fichier secret ${filePath}: `, error);
    return defaultValue;
  }
};

// Récupérer la variable d'environnement ou lire un fichier de secret
const getEnvOrSecret = (envVar: string, defaultValue: string): string => {
  const secretFilePath = process.env[envVar];
  if (secretFilePath && secretFilePath.startsWith('../')) {
    return readSecret(secretFilePath, defaultValue);
  }
  return secretFilePath || defaultValue;
};


// Configuration de la base de données pour un microservice (par exemple, userManagement)
const dbConfig: DBConfig = {
  dialect: process.env.DB_DIALECT || 'postgres',
  host: getEnvOrSecret('DB_HOST', 'localhost'),
  port: parseInt(getEnvOrSecret('DB_PORT', '5432'), 10),
  user: getEnvOrSecret('DB_USERNAME', 'default_user'),
  password: getEnvOrSecret('DB_PASSWORD', 'default_password'),
  name: getEnvOrSecret('DB_DATABASE', 'default_db'),
  schema: process.env.DB_SCHEMA || 'public',
};


// Configuration de RabbitMQ
const rabbitMQConfig: RabbitMQConfig = {
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
const appConfig: AppConfig = {
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

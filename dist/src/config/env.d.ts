interface DBConfig {
    dialect: string;
    host: string;
    port: number;
    user: string;
    password: string;
    name: string;
    schema: string;
}
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
interface AppConfig {
    serviceName: string;
    serviceShortName: string;
    apiPort: number;
    nodeTlsRejectUnauthorized: boolean;
}
declare const dbConfig: DBConfig;
declare const rabbitMQConfig: RabbitMQConfig;
declare const appConfig: AppConfig;
declare const envConfig: {
    dbConfig: DBConfig;
    rabbitMQConfig: RabbitMQConfig;
    appConfig: AppConfig;
};
export { dbConfig, rabbitMQConfig, appConfig, envConfig };

import { Sequelize, Op, Options } from 'sequelize';
import { appConfig, dbConfig } from './env'; // Assurez-vous que env.ts est bien typé

// Types pour dbConfig et appConfig
interface DBConfig {
  name: string;
  user: string;
  password: string;
  host: string;
  port: number;
  dialect: 'postgres';
  schema: string;
}

interface AppConfig {
  env: string;
  serviceName: string;
  serviceShortName: string;
  apiPort: number;
  nodeTlsRejectUnauthorized: boolean;
}

// Configuration des opérateurs Sequelize
const operatorsAliases: Options['operatorsAliases'] = {
  _and: Op.and,
  _or: Op.or,
  _eq: Op.eq,
  _ne: Op.ne,
  _is: Op.is,
  _not: Op.not,
  _col: Op.col,
  _gt: Op.gt,
  _gte: Op.gte,
  _lt: Op.lt,
  _lte: Op.lte,
  _between: Op.between,
  _notBetween: Op.notBetween,
  _all: Op.all,
  _in: Op.in,
  _notIn: Op.notIn,
  _like: Op.like,
  _notLike: Op.notLike,
  _startsWith: Op.startsWith,
  _endsWith: Op.endsWith,
  _substring: Op.substring,
  _iLike: Op.iLike,
  _notILike: Op.notILike,
  _regexp: Op.regexp,
  _notRegexp: Op.notRegexp,
  _iRegexp: Op.iRegexp,
  _notIRegexp: Op.notIRegexp,
  _any: Op.any,
  _contains: Op.contains,
  _contained: Op.contained,
  _overlap: Op.overlap,
  _adjacent: Op.adjacent,
  _strictLeft: Op.strictLeft,
  _strictRight: Op.strictRight,
  _noExtendRight: Op.noExtendRight,
  _noExtendLeft: Op.noExtendLeft,
  _values: Op.values
};

// Création de l'instance Sequelize avec la configuration typée
const db: Sequelize = new Sequelize(dbConfig.name, dbConfig.user, dbConfig.password, {
  dialect: 'postgres',
  host: dbConfig.host,
  port: dbConfig.port,
  logging: console.log, // Remplace logger.info par console.log
  schema: dbConfig.schema,
  benchmark: true,
  retry: {
    max: 3,
  },
  native: false,
  operatorsAliases,
});

// Fonction pour gérer la connexion à la base de données avec typage
const connect = async (): Promise<void> => {
  try {
    await db.authenticate();
    console.log(
      `Connection has been established successfully to db: ${dbConfig.host} port: ${dbConfig.port}`
    );
  } catch (error) {
    console.error(
      `Unable to connect to the database ${dbConfig.host} port ${dbConfig.port}: `,
      error
    );
    
    // Tentative de reconnexion avec port fixe
    const retryDb = new Sequelize(dbConfig.name, dbConfig.user, dbConfig.password, {
      dialect: 'postgres',
      host: dbConfig.host,
      port: 5432,  // Tentative avec le port par défaut
      schema: dbConfig.schema,
      benchmark: true,
      retry: {
        max: 3,
      },
      native: true,
      operatorsAliases,
    });

    console.log(`Retrying connection to db: ${dbConfig.host} on port: 5432`);

    try {
      await retryDb.authenticate();
      console.log(
        `Connection has been established successfully to db: ${dbConfig.host} port: 5432`
      );
    } catch (error) {
      console.error(
        `Unable to connect to the database ${dbConfig.host} port 5432: `,
        error
      );

      // Dernière tentative de reconnexion avec le port d'origine
      const finalDb = new Sequelize(dbConfig.name, dbConfig.user, dbConfig.password, {
        dialect: 'postgres',
        host: dbConfig.host,
        port: dbConfig.port,
        schema: dbConfig.schema,
        benchmark: true,
        native: true,
        operatorsAliases,
      });

      console.log(`Last retry to connect to db: ${dbConfig.host} and port: ${dbConfig.port}`);

      try {
        await finalDb.authenticate();
        console.log(
          `Connection has been established successfully to db: ${dbConfig.host} port: ${dbConfig.port}`
        );
      } catch (error) {
        console.error(
          `Unable to connect to the database ${dbConfig.host} port ${dbConfig.port}: `,
          error
        );
        console.error('Please configure your links and reboot.');
      }
    }
  }
};

export { db };

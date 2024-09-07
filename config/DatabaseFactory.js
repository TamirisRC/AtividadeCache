import MysqlDatabase from './mysqlDatabase.js';
import MongoDatabase from './mongoDatabase.js';

class DatabaseFactory {
    static createDatabase(config) {
        switch (config.DB_TYPE) {
            case 'mysql':
                return new MysqlDatabase(config);
            case 'mongodb':
                 return new MongoDatabase(config);
            default:
                throw new Error(`Unsupported database type: ${config.DB_TYPE}`);
        }
    }
}

export default DatabaseFactory;

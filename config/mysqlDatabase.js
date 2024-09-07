import mysql from 'mysql2/promise';

class MysqlDatabase {
    constructor(config) {
        this.config = {
            host: config.DB_HOST,
            user: config.DB_USER,
            password: config.DB_PASS,
            database: config.DB_NAME,
            port: config.DB_PORT,
        };
    }

    async connect() {
        try {
            this.connection = await mysql.createConnection(this.config);
            console.log('Conectado ao MySQL');
        } catch (error) {
            console.error('Erro ao conectar ao MySQL:', error);
        }
    }

    getConnection() {
        return this.connection;
    }
}

export default MysqlDatabase;
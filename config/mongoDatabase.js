import { MongoClient } from 'mongodb';
import dotenv from 'dotenv';

dotenv.config();

class MongoDatabase {
    constructor() {
        this.uri = process.env.MONGODB_URI;
        this.client = new MongoClient(this.uri); // Remova as opções aqui
        this.db = null;
        this.connectionTime = 0;
    }

    async connect() {
        const start_time = process.hrtime();
        try {
            await this.client.connect();
            this.db = this.client.db();
            const end_time = process.hrtime(start_time);
            this.connectionTime = (end_time[0] * 1e9 + end_time[1]) / 1e6;
            console.log(`Conectado ao MongoDB em ${this.connectionTime}ms`);
        } catch (error) {
            console.error('Erro ao conectar ao MongoDB:', error);
            throw error;
        }
    }

    getConnection() {
        return this.db;
    }

    getConnectionTime() {
        return this.connectionTime;
    }

    close() {
        return this.client.close();
    }
}

export default MongoDatabase;
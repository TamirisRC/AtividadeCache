import express from 'express';
import PessoaController from '../controllers/pessoaController.js';

class PessoaRota {
    constructor(database) {
        this.router = express.Router();
        this.controller = new PessoaController(database);
        this.setupRoutes();
    }

    setupRoutes() {
        this.router.post('/pessoa', (req, res) => this.controller.adicionarPessoa(req, res));
        this.router.get('/pessoas', (req, res) => this.controller.obterPessoas(req, res));
    }
}

export default PessoaRota;
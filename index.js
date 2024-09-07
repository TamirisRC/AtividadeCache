import express from 'express';
import bodyParser from 'body-parser';
import handlebars from 'express-handlebars';
import NodeCache from 'node-cache';
import axios from 'axios';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { authenticateToken } from './middlewares/authenticateToken.js';
import MongoDatabase from './config/mongoDatabase.js';
import MysqlDatabase from './config/mysqlDatabase.js';
import MongoPessoaModel from './models/MongoPessoaModel.js';
import MysqlPessoaModel from './models/MysqlPessoaModel.js';
import PessoaRota from './rotas/PessoaRota.js';
import path from 'path';
import { fileURLToPath } from 'url';

const JWT_SECRET = 'mysecrettoken';
const app = express();
const myCache = new NodeCache(); 
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
//app.use(express.static(path.join(__dirname, 'public'))); 
app.use('/public', express.static('public'));

app.engine("handlebars", handlebars.engine({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

//const mongoDb = new MongoDatabase();
//await mongoDb.connect();
//const mongoPessoaModel = new MongoPessoaModel(mongoDb.getConnection(), mongoDb.getConnectionTime());

const mysqlDb = new MysqlDatabase(process.env);
await mysqlDb.connect();
const mysqlPessoaModel = new MysqlPessoaModel(mysqlDb.getConnection());

app.post('/cadastro', async (req, res) => {
    const { nome, idade, senha, sexo, cep, logradouro, bairro, cidade, estado } = req.body;

    if (!nome || !idade || !senha || !sexo || !cep || !logradouro || !bairro || !cidade || !estado) {
        return res.status(400).json({ error: 'Todos os campos são obrigatórios.' });
    }

    try {
        const hashedPassword = await bcrypt.hash(senha, 10);
        const usuarioResult = await mysqlPessoaModel.adicionarUsuario(nome, idade, senha, sexo);
        await mysqlPessoaModel.adicionarEndereco(usuarioResult.insertId, cep, logradouro, bairro, cidade, estado);
        return res.redirect('/')
        res.status(200).json({ message: 'Cadastro realizado com sucesso.' });
    } catch (error) {
        console.error('Erro ao cadastrar:', error);
        res.status(500).json({ error: 'Erro interno do servidor.' });
    }
});

app.post('/login', async (req, res) => {
    const { nome, senha } = req.body;

    if (!nome || !senha) {
        return res.status(400).json({ error: 'Nome e senha são obrigatórios.' });
    }

    try {
        const user = await mysqlPessoaModel.buscarUsuarioPorNome(nome);

        if (!user) {
            console.log('Usuário não encontrado:', nome);
            return res.status(401).json({ error: 'Credenciais inválidas.' });
        }

        console.log('Usuário encontrado:', user);

        const senhaCorreta = await mysqlPessoaModel.verificarSenha(senha, user.senha);
        // const senhaCorreta = mysqlPessoaModel.verificarSenhaCriptografado(senha, user.senha);

        console.log('Senha fornecida:', senha);
        console.log('Hash da senha armazenado:', user.senha);
        console.log('Senha fornecida é correta?', senhaCorreta);

        if (!senhaCorreta) {
            console.log('Senha incorreta');
            return res.status(401).json({ error: 'Credenciais inválidas.' });
        }

        const token = jwt.sign({ nome: user.nome }, JWT_SECRET, { expiresIn: '1h' });

        res.json({ message: 'Login bem-sucedido', token });
    } catch (error) {
        console.error('Erro ao fazer login:', error);
        res.status(500).json({ error: 'Erro interno do servidor.' });
    }
});

//app.use('/pessoas', new PessoaRota(mongoPessoaModel).router);
app.use('/pessoas', new PessoaRota(mysqlPessoaModel).router);

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'login.html'));
});

app.get('/cadastro', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'cadastro.html'));
});

app.get("/getCEP/:cep", async (req, res) => {
    try {
        const data = await getCEP(req.params.cep);
        res.json({ data, success: 1 });
    } catch (e) {
        console.error('Erro:', e);
        res.json({ data: `Erro Inesperado: ${e}`, success: 0 });
    }
});

async function makeGet(cep) {
    try {
        const url = `https://viacep.com.br/ws/${cep}/json/`;
        const response = await axios.get(url);
        myCache.set(cep, response.data, 10000);
        return response.data;
    } catch (error) {
        throw error;
    }
}

async function getCEP(cep) {
    return new Promise((resolve, reject) => {
        if (myCache.has(cep)) {
            const data = myCache.get(cep);
            data.tipo = "cache";
            resolve(data);
        } else {
            makeGet(cep).then(response => {
                const data = response;
                data.tipo = "get";
                resolve(data);
            }).catch(reject);
        }
    });
}

app.listen(3000, () => {
    console.log("Servidor Ativo na Porta 3000!");
});
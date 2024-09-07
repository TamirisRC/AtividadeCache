# Sistema de Estatísticas de Intenção de Votos - Back-end (Node.js)
Este é o back-end do sistema autônomo para levantamento de estatísticas de intenção de votos para a prefeitura de São Paulo, agora implementado em Node.js. Ele é responsável por armazenar os votos dos usuários e fornecer as informações necessárias para a geração de gráficos no front-end.
 
o link do front funcionando:
https://prefeitosp.faustinopsy.com


## Funcionalidades
Registro de votos de usuários, incluindo o candidato e a região escolhidos.
Verificação se um usuário já registrou um voto.
Geração de dados agregados para os gráficos, tanto por candidato quanto por região.
Suporte a várias bases de dados, incluindo MySQL, SQLite, PostgreSQL, Oracle, SQL Server e MongoDB.
## Estrutura do Projeto
- /config/: Contém a configuração de banco de dados e fábricas de conexão.
- /controllers/: Contém os controladores responsáveis por gerenciar as requisições e respostas da API.
- /models/: Modelos que interagem com o banco de dados para manipulação dos dados.
- /routes/: Definição das rotas de API e suas respectivas funções.
## Instalação
Clone este repositório:

```bash
git clone https://github.com/faustinopsy/prefeito-back-node.git
```
### Instale as dependências via npm:

```bash
npm install
```

### Configure o arquivo .env com as informações do seu banco de dados:

```bash
Copiar código
DB_TYPE=mysql
DB_HOST=localhost
DB_NAME=nome_do_banco
DB_USER=usuario
DB_PASS=senha
DB_PORT=3306
DB_SID=nome_do_sid # Para Oracle

```
### Inicie o servidor Node.js:

```bash
npm start
```
## Uso
API de Votação
- POST /voto: Registra um novo voto.
- GET /voto/quantidade: Retorna a quantidade total de votos por candidato.
- GET /voto/quantidade_por_regiao: Retorna a quantidade de votos por candidato agrupados por região.

## Privacidade
O sistema não captura endereços IP ou qualquer dado pessoal identificável. Apenas um identificador único, gerado a partir de dados do navegador, é utilizado para verificar se um usuário já votou.

## Tecnologias Utilizadas
- Node.js: Ambiente de execução do JavaScript no servidor.
- Express: Framework web para Node.js.
SQLite, MySQL, PostgreSQL, MongoDB: Bancos de dados suportados.
- dotenv: Para gerenciamento de variáveis de ambiente.
- morgan: Logger de requisições HTTP para Node.js.
- cors: Middleware para habilitar CORS (Cross-Origin Resource Sharing).
## Explicação do index.js
````javascript
import 'dotenv/config'; 
import express from 'express';
import morgan from 'morgan';
import DatabaseFactory from './config/databaseFactory.js';
import VotoRota from './rotas/votoRota.js';
import bodyParser from 'body-parser';
import cors from 'cors';

const app = express();
const port = process.env.PORT || 3000;

// Configuração do CORS
const corsOptions = {
  origin: ['http://127.0.0.1:5500','http://localhost:5500', 'http://localhost:8088', 'http://127.0.0.1:8088'],
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  allowedHeaders: ['Content-Type', 'Authorization', 'X-API-KEY', 'X-Requested-With', 'X-Custom-Header'],
  credentials: true,
  optionsSuccessStatus: 204
};

// Middlewares
/* morgan Logger de requisições HTTP
é para mostrar no console do servidor as requisições o que já é padronizado no PHP

*/
app.use(morgan('combined')); 
app.use(cors(corsOptions));  // Configuração de CORS
app.use(bodyParser.json());  // Parser de JSON para requisições
app.use(bodyParser.urlencoded({ extended: true }));  // Parser de URL encoded para requisições

// Criação da conexão com o banco de dados
const database = DatabaseFactory.createDatabase(process.env);

const start_time = process.hrtime();
database.connect().then(() => {
    const end_time = process.hrtime(start_time);
    const connectionTime = (end_time[0] * 1e9 + end_time[1]) / 1e6; 
    console.log(`Conexão ao banco de dados estabelecida em ${connectionTime}ms`);

    // Configuração das rotas
    const votoRoutes = new VotoRota(database);
    /* Prefixo '/index.php' para facilitar a troca de URL no frontend
      aqui precisa de uma atenção exspecial, pois o arquivo não precisa existir, é apenas o parametro na url
      pois no backend php há uma restrição então para apenas trocar a URL base no front pode trocar o backend trocando apenas uma linha sem outros ajustes
    */
    app.use('/index.php', votoRoutes.router); 

    // Inicialização do servidor
    app.listen(port, () => {
        console.log(`Servidor rodando na porta ${port}`);
    });
}).catch((err) => {
    console.error('Erro ao conectar ao banco de dados:', err);
});
````

## Explicação das Principais Partes
- CORS Options: Configura as origens permitidas para acessar o backend, especificando quais métodos e cabeçalhos são permitidos.

- DatabaseFactory: Cria a conexão com o banco de dados baseado no tipo especificado no arquivo .env. aqui é importante destacar a estrategia de troca de banco de forma simples, os três principais bancos foram testados, MySQL, MongoDB, e SQlite~.~

- app.use('/index.php', votoRoutes.router): Define o prefixo /index.php para as rotas. Isso facilita a troca de URL no frontend sem a necessidade de alterar o código no backend.

- database.connect(): Estabelece a conexão com o banco de dados antes de inicializar as rotas e o servidor.

## Licença
Este projeto é distribuído sob a licença MIT. Consulte o arquivo LICENSE para mais informações.

import mysql from 'mysql2/promise';
import bcrypt from 'bcrypt';

export default class MysqlPessoaModel {
    constructor(connection) {
        this.connection = connection;
    }

    async adicionarUsuario(nome, idade, senha, sexo) {
        const hashedPassword = await bcrypt.hash(senha, 10); 
        const [result] = await this.connection.execute(
            'INSERT INTO usuarios (nome, idade, senha, sexo) VALUES (?, ?, ?, ?)',
            [nome, idade, hashedPassword, sexo]
        );
        return result;
    }

    async adicionarEndereco(usuarioId, cep, logradouro, bairro, cidade, estado) {
        const [result] = await this.connection.execute(
            'INSERT INTO enderecos (usuario_id, cep, logradouro, bairro, cidade, estado) VALUES (?, ?, ?, ?, ?, ?)',
            [usuarioId, cep, logradouro, bairro, cidade, estado]
        );
        return result;
    }

    async buscarUsuarioPorNome(nome) {
        const [rows] = await this.connection.execute(
            'SELECT * FROM usuarios WHERE nome = ?',
            [nome]
        );
        return rows[0];
    }

    async verificarSenha(senha, hashedPassword) {
        return await bcrypt.compare(senha, hashedPassword);
    }

    verificarSenhaCriptografado(senha, hashedPassword) {
        return senha == hashedPassword;
    }
}
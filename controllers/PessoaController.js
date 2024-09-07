class PessoaController {
  constructor(database) {
      this.database = database;
  }

  async adicionarPessoa(req, res) {
      const { nome, idade, sexo, endereco } = req.body;
      const result = await this.database.adicionarPessoa(nome, idade, sexo, endereco);
      res.json(result);
  }

  async obterPessoas(req, res) {
      const result = await this.database.obterPessoas();
      res.json(result);
  }
}

export default PessoaController;
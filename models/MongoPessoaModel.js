class MongoPessoaModel {
  constructor(db, connectionTime) {
      this.db = db;
      this.connectionTime = connectionTime;
      this.collection = this.db.collection('pessoas');
  }

  async adicionarPessoa(nome, idade, sexo, endereco) {
      try {
          const start_time = process.hrtime();

          const result = await this.collection.insertOne({
              nome,
              idade,
              sexo,
              endereco,
              data_inclusao: new Date()
          });

          const end_time = process.hrtime(start_time);
          const queryTime = (end_time[0] * 1e9 + end_time[1]) / 1e6;

          return {
              success: true,
              message: "Pessoa adicionada com sucesso.",
              connection_time: this.connectionTime,
              query_time: queryTime
          };
      } catch (error) {
          return {
              success: false,
              message: `Erro ao adicionar pessoa: ${error.message}`,
              connection_time: this.connectionTime
          };
      }
  }

  async obterPessoas() {
      try {
          const start_time = process.hrtime();

          const result = await this.collection.find().toArray();

          const end_time = process.hrtime(start_time);
          const queryTime = (end_time[0] * 1e9 + end_time[1]) / 1e6;

          return {
              success: true,
              data: result,
              connection_time: this.connectionTime,
              query_time: queryTime
          };
      } catch (error) {
          return {
              success: false,
              message: `Erro ao obter pessoas: ${error.message}`,
              connection_time: this.connectionTime
          };
      }
  }
}

export default MongoPessoaModel;
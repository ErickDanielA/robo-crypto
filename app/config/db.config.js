module.exports = {
    HOST: "localhost",
    USER: "root",
    PASSWORD: "",
    DB: "crypto_estatisticas",
    //Define o tipo de banco de dados que está sendo usado
    dialect: "mysql",
    //Este é um objeto de configuração para o pool de conexões, que controla como as conexões com o banco de dados são gerenciadas.
    pool: {
      //Define o número máximo de conexões que podem ser mantidas no pool simultaneamente    
      max: 5,
      //Define o número mínimo de conexões que devem estar ativas no pool
      min: 0,
      //O tempo máximo (em milissegundos) que o pool tentará estabelecer uma conexão antes de lançar um erro
      acquire: 30000,
      //O tempo máximo (em milissegundos) que uma conexão pode ficar ociosa antes de ser liberada
      idle: 10000
    }
  };
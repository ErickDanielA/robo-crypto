const db = require('./app/models'); // Ajuste o caminho conforme necessário
const Financas = db.financas;

db.sequelize.sync({ force: true }) // `force: true` recria a tabela a cada execução
  .then(() => {
    console.log("Tables have been created.");
  })
  .catch(err => {
    console.error("Error creating tables:", err);
  });
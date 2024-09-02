const db = require("../models");
const Financas = db.financas;
const Op = db.Sequelize.Op;
/***
 * Cria uma tabela de financas
 * @param {valor_BUY} NUMBER
 * @param {valor_SELL} NUMBER
 * @param {BTC_BUY} NUMBER
 * @param {BTC_SELL} NUMBER
 * @param {lucro} NUMBER
 * @param {compra} date
 */
exports.create = (valor_BUY, valor_SELL, BTC_BUY, BTC_SELL, lucro, compra) => {
    // Validate request
    // if (!req.body.BTC_VALOR_BUY || !req.body.BTC_VALOR_SELL) {
    //   res.status(400).send({
    //     message: "Content can not be empty!"
    //   });
    //   return;
    // }
  
    // Create a Financas
    const financas = {
        BTC_VALOR_BUY: valor_BUY,
        BTC_VALOR_SELL: valor_SELL,
        BTC_BUY: BTC_BUY,
        BTC_SELL: BTC_SELL,
        LUCRO: lucro,
        HORA_COMPRA: compra
    };

    // WEB \/
    // const financas = {
    //     BTC_VALOR_BUY: req.body.BTC_VALOR_BUY,
    //     BTC_VALOR_SELL: req.body.BTC_VALOR_SELL,
    //     BTC_BUY: req.body.BTC_BUY,
    //     BTC_SELL: req.body.BTC_SELL,
    //     LUCRO: req.body.LUCRO,
    // };
  
    // Save Financas in the database
    Financas.create(financas)
      .then(data => {
        console.log(data);
      })
      .catch(err => {
        // res.status(500).send({
        //   message:
           console.log(err.message || "Some error occurred while creating the Financas record.")
        // });
      });
  };


  
  
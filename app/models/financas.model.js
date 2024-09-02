module.exports = (sequelize, Sequelize) => {
    const Financas = sequelize.define("financas", {
        id: {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        BTC_VALOR_BUY: {
            type: Sequelize.DECIMAL
        },
        BTC_VALOR_SELL: {
            type: Sequelize.DECIMAL
        },
        BTC_BUY: {
            type: Sequelize.DECIMAL
        },
        BTC_SELL: {
            type: Sequelize.DECIMAL
        },
        LUCRO: {
            type: Sequelize.DECIMAL
        },
        HORA_COMPRA: {
            type: Sequelize.DATE
        }
        
    },
    {
        timestamps: true, // Adiciona automaticamente createdAt e updatedAt
        // tableName: 'tutorials' // Especifica o nome da tabela, caso seja diferente do nome do modelo
      });

    return Financas;
};
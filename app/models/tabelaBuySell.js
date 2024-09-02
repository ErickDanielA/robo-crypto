module.exports = (sequelize, Sequelize) => {
    const Tutorial = sequelize.define("tutorial", {
        id: {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        BTC_VALOR_BUY: {
            type: Sequelize.STRING
        },
        BTC_VALOR_SELL: {
            type: Sequelize.BOOLEAN
        },
        BTC_BUY: {
            type: Sequelize.STRING
        },
        BTC_SELL: {
            type: Sequelize.STRING
        },
        LUCRO: {
            type: Sequelize.DECIMAL
        }
        
    },
    {
        timestamps: true, // Adiciona automaticamente createdAt e updatedAt
        // tableName: 'tutorials' // Especifica o nome da tabela, caso seja diferente do nome do modelo
      });

    return Tutorial;
};
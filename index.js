const crypto = require("crypto");
const axios = require("axios");
const https = require("https");

const symbol = "BTCUSDT";
const quantity = "0.001";

const API_URL = "https://testnet.binance.vision"; // Use este URL para testar em ambiente de teste da Binance
const API_KEY = "4NMo1palHRADOoSQNR8jHrPNIDtdjBv6CSmFZml6tmWlVQmberkejH7iJ0ZfdJq6";
const SECRET_KEY = "WeMC0Zrx5EOJ2uXZnxBe2VSN7PeUodE4d6Pau75dYmWDsh6OmUPEr9Fn2lWMO9CO";

const axiosInstance = axios.create({
    baseURL: API_URL,
    httpsAgent: new https.Agent({ keepAlive: true }), // Agente para manter a conexão viva
    timeout: 15000, // Timeout de 15 segundos
    headers: {
        "X-MBX-APIKEY": API_KEY,
    },
});

let isOpened = false;
let valcompra = 0;
let money = 0;

// Função para calcular a Média Móvel Exponencial (EMA)
function calculateEMA(prices, period) {
    const k = 2 / (period + 1);
    let emaArray = [prices[0]]; // Inicializa o EMA com o primeiro preço

    for (let i = 1; i < prices.length; i++) {
        const ema = prices[i] * k + emaArray[i - 1] * (1 - k);
        emaArray.push(ema);
    }

    return emaArray;
}

async function start() { try {    
    const { data } = await axiosInstance.get(API_URL + "/api/v3/klines?limit=50&interval=15m&symbol=" + symbol);
    const prices = data.map(candle => parseFloat(candle[4]));
    const price = prices[prices.length - 1];

    console.log("Preço Atual: " + price);
    console.log("R$ " + money);

    // Calcula EMAs curta e longa
    const shortEMA = calculateEMA(prices, 12);
    const longEMA = calculateEMA(prices, 26);

    // Sinal de Compra: EMA curta cruza acima da EMA longa
    if (shortEMA[shortEMA.length - 1] > longEMA[longEMA.length - 1] && !isOpened) {
        isOpened = true;
        console.log("Sinal de Compra - Comprar");
        newOrder(symbol, quantity, "buy");
        valcompra = price;
    }
    // Sinal de Venda: EMA curta cruza abaixo da EMA longa
    else if (shortEMA[shortEMA.length - 1] < longEMA[longEMA.length - 1] && isOpened) {
        isOpened = false;
        console.log("Sinal de Venda - Vender");
        newOrder(symbol, quantity, "sell");
        money += price - valcompra; // Calcular lucro ou perda
    } else {
        console.log("Aguardar...");
        console.log(isOpened);
    }
} catch (err) {
    console.error("Erro ao conectar com a API da Binance: ", err.message);
    console.log("Tentando novamente em 10 segundos...");
    setTimeout(start, 10000); // Espera 10 segundos antes de tentar novamente
}
}

async function newOrder(symbol, quantity, side) {
    const order = { symbol, quantity, side };
    order.type = "MARKET";
    order.timestamp = Date.now();

    const query = new URLSearchParams(order).toString();

    const signature = crypto
        .createHmac("sha256", SECRET_KEY)
        .update(query)
        .digest("hex");

    const orderWithSignature = query + `&signature=${signature}`;

    
    try {
        const { data } = await axiosInstance.post(
            API_URL + "/api/v3/order",
            orderWithSignature,
            { headers: { "X-MBX-APIKEY": API_KEY } }
        );

        console.log(data);
    } catch (err) {
        console.error("Erro ao finalizar a transação: ", err.message);
        console.log("Tentando novamente em 10 segundos...");
        setTimeout(start, 10000); // Espera 10 segundos antes de tentar novamente
    }
}

setInterval(start, 3000);

start();

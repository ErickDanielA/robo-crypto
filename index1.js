const crypto = require("crypto");
const axios = require("axios");
const https = require("https");

const symbol = "BTCUSDT";
const buy_price = 61200;
const sell_price = 61250;
const quantity = "0.001";

const API_URL = "https://testnet.binance.vision";
//API Binance TEST
const API_KEY = "4NMo1palHRADOoSQNR8jHrPNIDtdjBv6CSmFZml6tmWlVQmberkejH7iJ0ZfdJq6";
const SECRET_KEY = "WeMC0Zrx5EOJ2uXZnxBe2VSN7PeUodE4d6Pau75dYmWDsh6OmUPEr9Fn2lWMO9CO";
const profitability = parseFloat(process.env.PROFITABILITY);

const axiosInstance = axios.create({
    baseURL: API_URL,
    timeout: 60000, //optional
    httpsAgent: new https.Agent({ keepAlive: true }),
    headers: { "X-MBX-APIKEY": API_KEY }
});

let qntsell = 0;
let qntbuy = 0;
let isOpened = false;
let valcompra = 0;
let money = 0;

function calcSMA(data) {
    const closes = data.map(candle => parseFloat(candle[4]));
    const sum = closes.reduce((a, b) => a + b);
    return sum / data.length;
}

// Função para calcular a Média Móvel Exponencial (EMA)
function calculateEMA(prices, period) {
    const k = 2 / (period + 1);  // Fator de suavização
    let emaArray = [];  // Array para armazenar os valores da EMA

    // Calcular a SMA inicial para o primeiro valor da EMA
    const initialSMA = prices.slice(0, period).reduce((acc, price) => acc + price, 0) / period;
    emaArray.push(initialSMA);

    // Calcular a EMA para cada ponto de dados subsequente
    for (let i = period; i < prices.length; i++) {
        const currentPrice = prices[i];
        const previousEMA = emaArray[emaArray.length - 1];
        const currentEMA = currentPrice * k + previousEMA * (1 - k);
        emaArray.push(currentEMA);
    }

    return emaArray;
}

async function start() {
    const { data } = await axiosInstance.get(API_URL + "/api/v3/klines?limit=21&interval=15m&symbol=" + symbol);
    const prices = data.map(candle => parseFloat(candle[4]));
    const price = prices[prices.length - 1];
    const candle = data[data.length - 1];
    console.log("Buy: " + qntbuy);
    console.log("Sell: " + qntsell);
    console.log("Preço: " + price);
    console.log("R$ " + money);

    // Calcula EMAs curta e longa
    const shortEMA = calculateEMA(prices, 12);
    const longEMA = calculateEMA(prices, 21);

    const sma = calcSMA(data);
    console.log("SMA: " + sma);
    console.log(isOpened);

    if (shortEMA[shortEMA.length - 1] > longEMA[longEMA.length - 1] && !isOpened) {
        isOpened = true;
        console.log("comprar");
        newOrder(symbol, quantity, "buy");
        qntbuy++;
        valcompra = price;
    }
    else if (shortEMA[shortEMA.length - 1] < longEMA[longEMA.length - 1] && isOpened) {
        isOpened = false;
        console.log("vender");
        newOrder(symbol, quantity, "sell");
        qntsell++;
        money += price - valcompra
    }
    else
        console.log("aguardar");
        // console.log(shortEMA);
        // console.log(data);
        // console.log("Long: "+ longEMA);
}

async function newOrder(symbol, quantity, side) {
    const order = { symbol, quantity, side }
    order.type = "MARKET";
    order.timestamp = Date.now();

    const signature = crypto
        .createHmac("sha256", SECRET_KEY)
        .update(new URLSearchParams(order).toString())
        .digest("hex");

    order.signature = signature;

    try {
        const { data } = await axios.post(
            API_URL + "/api/v3/order",
            new URLSearchParams(order).toString(),
            { headers: { "X-MBX-APIKEY": API_KEY } }
        )

        // console.log(data);
    }
    catch (err) {
        console.error(err.response.data);
    }
}

setInterval(start, 3000)

start();
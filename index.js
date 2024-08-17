const axios = require("axios");

const symbol = "BTCUSDT";
const buy_price = 59235;
const sell_price = 59329;

const API_URL = "https://testnet.binance.vision";

let qntsell = 0;
let qntbuy = 0;
let isOpened = false;
let valcompra = 0;
let money = 0;

function calcSMA(data){
    const closes = data.map(candle => parseFloat(candle[4]));
    const sum = closes.reduce((a, b) => a + b);
    return sum / data.length;
}

async function start() {
    const { data } = await axios.get(API_URL + "/api/v3/klines?limit=21&interval=15m&symbol=" + symbol);
    const candle = data[data.length - 1];
    const price = parseFloat(candle[4]);
    console.log("Buy: " + qntbuy);
    console.log("Sell: " + qntsell);
    console.log("Preço: " + price);
    console.log("R$ " + money);

    const sma = calcSMA(data);
    console.log("SMA: " + sma);
    console.log("Is Opened? " + isOpened);

    if (price <= buy_price && isOpened == false) {
        console.log("comprar");
        isOpened = true;
        qntbuy++;
        valcompra = price;
    }
    else if (price >= sell_price && isOpened == true) {
        console.log("vender");
        isOpened = false;
        qntsell++;
        money = price - valcompra
    }
    else
        console.log("aguardar");
}

setInterval(start, 3000);

start();
const axios = require("axios");

const symbol = "BTCUSDT";
const buy_price = 59010;
const sell_price = 59145;

const API_URL = "https://testnet.binance.vision";

let qntsell = 0;
let qntbuy = 0;
let isOpened = false;

async function start() {
    const { data } = await axios.get(API_URL + "/api/v3/klines?limit=21&interval=15m&symbol=" + symbol);
    const candle = data[data.length - 1];
    const price = parseFloat(candle[4]);
    console.log("Buy: " + qntbuy);
    console.log("Sell: " + qntsell);
    console.log("Preço: " + price);

    if (price <= buy_price && isOpened == false) {
        console.log("comprar");
        isOpened = true;
        qntbuy++;
    }
    else if (price >= sell_price && isOpened == true) {
        console.log("vender");
        isOpened = false;
        qntsell++;
    }
    else
        console.log("aguardar");
}

setInterval(start, 3000);

start();
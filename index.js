const crypto = require("crypto");
const axios = require("axios");

const symbol = "BTCUSDT";
const buy_price = 61200;
const sell_price = 61250;
const quantity = "0.001";

const API_URL = process.env.STREAM_URL;
//API Binance TEST
const API_KEY = "4NMo1palHRADOoSQNR8jHrPNIDtdjBv6CSmFZml6tmWlVQmberkejH7iJ0ZfdJq6";
const SECRET_KEY = "WeMC0Zrx5EOJ2uXZnxBe2VSN7PeUodE4d6Pau75dYmWDsh6OmUPEr9Fn2lWMO9CO";
const profitability = parseFloat(process.env.PROFITABILITY);

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
        isOpened = true;
        console.log("comprar");
        newOrder(symbol, quantity, "buy");
        qntbuy++;
        valcompra = price;
    }
    else if (price >= sell_price && isOpened == true && price <= valcompra * profitability) {
        isOpened = false;
        console.log("vender");
        newOrder(symbol, quantity, "sell");
        qntsell++;
        money = price - valcompra
    }
    else
        console.log("aguardar");
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

    try{
        const {data} = await axios.post(
            API_URL + "/api/v3/order",
            new URLSearchParams(order).toString(),
            {headers: {"X-MBX-APIKEY" : API_KEY}}
        )

        console.log(data);
    }
    catch(err){
        console.error(err.response.data);
    }
}

setInterval(start, 3000);

start();
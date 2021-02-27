// A2Z F17
// Daniel Shiffman
// http://shiffman.net/a2z
// https://github.com/shiffman/A2Z-F17

// Using the Twit node package
// https://github.com/ttezel/twit
var Twit = require('twit');

// Pulling all my twitter account info from another file
var config = require('./config.js');

// Making a Twit object for connection to the API
var T = new Twit(config);

const https = require('https');


var bondPrice = 62;
var bondMarketCap = 1000000;

setInterval(function () {
    https.get('https://api.coingecko.com/api/v3/coins/barnbridge', (resp) => {
        let data = '';

        // A chunk of data has been recieved.
        resp.on('data', (chunk) => {
            data += chunk;
        });

        // The whole response has been received. Print out the result.
        resp.on('end', () => {
            try {
                let result = JSON.parse(data);
                bondPrice = result.market_data.current_price.usd;
                bondPrice = Math.round(((bondPrice * 1.0) + Number.EPSILON) * 1000) / 1000;
                bondMarketCap = result.market_data.market_cap.usd;
            } catch (e) {
                console.log(e);
            }

        });

    }).on("error", (err) => {
        console.log("Error: " + err.message);
    });

}, 45 * 1000);

let cSupply = 869164.76;
setInterval(function () {
    try {
        https.get('https://tokenapi.barnbridge.com/circulating-supply', (resp) => {
            let data = '';

            // A chunk of data has been recieved.
            resp.on('data', (chunk) => {
                data += chunk;
            });

            // The whole response has been received. Print out the result.
            resp.on('end', () => {
                try {
                    let result = JSON.parse(data) * 1.0;
                    cSupply = result.toFixed(2);
                } catch (e) {
                    console.log(e);
                }
            });

        }).on("error", (err) => {
            console.log("Error: " + err.message);
        });
    } catch (e) {
        console.log(e);
    }
}, 50 * 1000);

let daoBond = 214311.49;
setInterval(function () {
    try {
        https.get('https://api.etherscan.io/api?module=account&action=tokenbalance&contractaddress=0x0391d2021f89dc339f60fff84546ea23e337750f&address=0x10e138877df69Ca44Fdc68655f86c88CDe142D7F&tag=latest', (resp) => {
            let data = '';

            // A chunk of data has been recieved.
            resp.on('data', (chunk) => {
                data += chunk;
            });

            // The whole response has been received. Print out the result.
            resp.on('end', () => {
                try {
                    let result = JSON.parse(data).result / 1e18;
                    if (!isNaN(result)) {
                        daoBond = result.toFixed(2);
                    }
                } catch (e) {
                    console.log(e);
                }
            });

        }).on("error", (err) => {
            console.log("Error: " + err.message);
        });
    } catch (e) {
        console.log(e);
    }
}, 40 * 1000);

// Here is the bot!
function tweeter() {

    // This is a random number bot
    var tweet = "BarnBridge Token Stats daily:\n" +
        "$BOND Price: $" + bondPrice + " \n" +
        "Market Cap: $" + numberWithCommas(bondMarketCap) + " \n" +
        "Circulating Supply: " + numberWithCommas(cSupply) + " \n" +
        "$BOND Staked in DAO: " + numberWithCommas(daoBond);

    // Post that tweet!
    T.post('statuses/update', {status: tweet}, tweeted);

    // Callback for when the tweet is sent
    function tweeted(err, data, response) {
        if (err) {
            console.log(err);
        } else {
            console.log('Success: ' + data.text);
            //console.log(response);
        }
    };

}


function delay(time) {
    return new Promise(function (resolve) {
        setTimeout(resolve, time)
    });
}

function numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

function getNumberLabel(labelValue) {

    // Nine Zeroes for Billions
    return Math.abs(Number(labelValue)) >= 1.0e+9

        ? Math.round(Math.abs(Number(labelValue)) / 1.0e+9) + "B"
        // Six Zeroes for Millions
        : Math.abs(Number(labelValue)) >= 1.0e+6

            ? Math.round(Math.abs(Number(labelValue)) / 1.0e+6) + "M"
            // Three Zeroes for Thousands
            : Math.abs(Number(labelValue)) >= 1.0e+3

                ? Math.round(Math.abs(Number(labelValue)) / 1.0e+3) + "K"

                : Math.abs(Number(labelValue));

}


let schedule = require('node-schedule');
let rule = new schedule.RecurrenceRule();

// your timezone
rule.tz = 'GMT';

// runs at 15:00:00
rule.second = 0;
rule.minute = 0;
rule.hour = 17;

// schedule
schedule.scheduleJob(rule, tweeter);

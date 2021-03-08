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
}, 60 * 1000 * 5);

function tweet1() {

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

let bondWalletsStaking;
let bondHolders;
let treasury;

setInterval(function () {
    try {
        https.get('https://api.barnbridge.com/api/governance/overview', (resp) => {
            let data = '';

            // A chunk of data has been recieved.
            resp.on('data', (chunk) => {
                data += chunk;
            });

            // The whole response has been received. Print out the result.
            resp.on('end', () => {
                try {
                    let result = JSON.parse(data);
                    if (!isNaN(result.data.holdersStakingExcluded)) {
                        bondHolders = result.data.holdersStakingExcluded * 1.0;
                    }
                    if (!isNaN(result.data.barnUsers)) {
                        bondWalletsStaking = result.data.barnUsers * 1.0;
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
}, 1000 * 60 * 10);

setInterval(function () {
    try {
        https.get('https://api.etherscan.io/api?module=account&action=tokenbalance&contractaddress=0x0391D2021f89DC339F60Fff84546EA23E337750f&address=0x4cAE362D7F227e3d306f70ce4878E245563F3069&tag=latest&apikey=YourApiKeyToken', (resp) => {
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
                        treasury = result * bondPrice;
                        treasury = treasury.toFixed(0);
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
}, 60 * 1000 * 15);


//

function tweet2() {

    // This is a random number bot
    var tweet = "$BOND Wallet Stats:\n" +
        "$BOND Wallets Staking BOND" + numberWithCommas(bondWalletsStaking) + " \n" +
        "$BOND Wallets with BOND:" + numberWithCommas(bondHolders) + " \n" +
        "Treasury Amount $" + numberWithCommas(treasury);

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

// function tweet3() {
//
//     // This is a random number bot
//     var tweet = "$BOND Wallet Stats:\n" +
//         "$BOND Wallets Staking BOND" + numberWithCommas(bondWalletsStaking) + " \n" +
//         "$BOND Wallets with BOND:" + numberWithCommas(bondHolders) + " \n" +
//         "Treasury Amount $" + numberWithCommas(treasury);
//
//     // Post that tweet!
//     T.post('statuses/update', {status: tweet}, tweeted);
//
//     // Callback for when the tweet is sent
//     function tweeted(err, data, response) {
//         if (err) {
//             console.log(err);
//         } else {
//             console.log('Success: ' + data.text);
//             //console.log(response);
//         }
//     };
//
// }


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

rule.second = 0;
rule.minute = 0;
rule.hour = 17;

// schedule
schedule.scheduleJob(rule, tweet1);

let rule2 = new schedule.RecurrenceRule();

// your timezone
rule2.tz = 'GMT';

rule2.second = 0;
rule2.minute = 0;
rule2.hour = 17;
rule2.dayOfWeek = 2;

// schedule
schedule.scheduleJob(rule2, tweet2);

// let rule3 = new schedule.RecurrenceRule();
//
// // your timezone
// rule3.tz = 'GMT';
//
// rule3.second = 0;
// rule3.minute = 0;
// rule3.hour = 17;
// rule3.dayOfWeek = 3;
//
// // schedule
// schedule.scheduleJob(rule3, tweet3);
//
// let rule4 = new schedule.RecurrenceRule();
//
// // your timezone
// rule4.tz = 'GMT';
//
// rule4.second = 0;
// rule4.minute = 0;
// rule4.hour = 19;
// rule4.dayOfWeek = 6;
//
// // schedule
// schedule.scheduleJob(rule4, tweet4);
//
// let rule5 = new schedule.RecurrenceRule();
//
// // your timezone
// rule5.tz = 'GMT';
//
// rule5.second = 0;
// rule5.minute = 0;
// rule5.hour = 17;
// rule5.dayOfWeek = 1;
//
// // schedule
// schedule.scheduleJob(rule4, tweet5);

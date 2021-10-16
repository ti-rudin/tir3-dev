
const redis = require("redis");
const TelegramBot = require('node-telegram-bot-api');

var subscriber = redis.createClient("//redis:6379");
//var subscriber = redis.createClient("//localhost:6379");
subscriber.auth("YzRAdGgkFg");

const client = redis.createClient("//redis:6379");
client.auth("YzRAdGgkFg");

const userid = process.env.GOOGLEUID;

const tgkey = process.env.TELEGRAM_BOT_TOKEN;
if (tgkey === undefined) {
  throw new TypeError('BOT_TOKEN must be provided!')
}

let chatidfromredis;
client.get(userid + "-chatid", function (err, reply) {
  chatidfromredis = reply;
  console.log("chat id " + chatidfromredis);
});

let chatid = process.env.CHATID || chatidfromredis;

const bot = new TelegramBot(tgkey, { polling: true });

function send(tgpost) {

  bot.sendMessage(chatid, tgpost);

}

function sendlead(botname, profit, duration, moneta) {

  let tgpost = '<b>' + botname + '</b> \nПрибыль: <pre>' + profit.toFixed(2) + ' ' + moneta + '</pre>\nДлительность: ' + duration;
  bot.sendMessage(chatid, tgpost, { parse_mode: "HTML" });

}



subscriber.on("message", function (channel, message) {
  let msgg = JSON.parse(message);

  if (msgg.guid == userid) {
    console.log(msgg);
    if (msgg.typemsg == "lead") {

      msgg.posttg = JSON.parse(msgg.posttg);

      sendlead(msgg.posttg.botname, msgg.posttg.profit, msgg.posttg.duration, msgg.posttg.moneta);


    } else {
      send(msgg.tgmsg);
    }

  }
});

subscriber.subscribe("tgpost");

let leads;
bot.on('message', (msg) => {

  if ((msg.text == 'id') || (msg.text == 'Id') || (msg.text == 'ID')) {
    bot.sendMessage(msg.chat.id, "CHAT ID: " + msg.chat.id);


     client.set(userid + "-chatid", msg.chat.id);


  } else {

    client.get(userid + "-leads", function (err, reply) {

      leads = JSON.parse(reply);
      let count = leads.length;
      var sum = 0;

      for (var i = 0; i < leads.length; i++) {

        let lead = leads[i];
        sum = sum + lead.profit;

      }

      let sr = sum / count;

      bot.sendMessage(msg.chat.id, "Сделок: <b>" + count + "</b>\nСумма: <pre>" + sum.toFixed(2) + "</pre>\nСреднее: <b>" + sr.toFixed(2) + "</b>", { parse_mode: "HTML" });

    });

  }

});

// Enable graceful stop
process.once('SIGINT', () => bot.stop('SIGINT'))
process.once('SIGTERM', () => bot.stop('SIGTERM'))
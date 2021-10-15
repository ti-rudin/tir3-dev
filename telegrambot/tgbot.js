
const redis = require("redis");

const client = redis.createClient("//redis:6379");
client.auth("YzRAdGgkFg");

const TelegramBot = require('node-telegram-bot-api');

const tgkey = process.env.TELEGRAM_BOT_TOKEN;
const chatid = process.env.CHATID;
const userid = process.env.GOOGLEUID;

if (tgkey === undefined) {
  throw new TypeError('BOT_TOKEN must be provided!')
}
const bot = new TelegramBot(tgkey, { polling: true });

function send(tgpost) {
  bot.sendMessage(chatid, tgpost);
}

let leads;
function sendlead(botname, profit, duration, moneta) {
  let tgpost = '<b>' + botname + '</b> \nПрибыль: <pre>' + profit.toFixed(2) + ' ' + moneta +'</pre>\nДлительность: ' + duration;
  bot.sendMessage(chatid, tgpost, { parse_mode: "HTML" });

}

var subscriber = redis.createClient("//redis:6379");
//var subscriber = redis.createClient("//localhost:6379");
subscriber.auth("YzRAdGgkFg");


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

bot.on('message', (msg) => {
  bot.sendMessage(msg.chat.id, "CHAT ID: " + msg.chat.id);
});

// Enable graceful stop
process.once('SIGINT', () => bot.stop('SIGINT'))
process.once('SIGTERM', () => bot.stop('SIGTERM'))
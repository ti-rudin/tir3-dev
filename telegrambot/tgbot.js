
const redis = require("redis");
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

var subscriber = redis.createClient("//redis:6379");
//var subscriber = redis.createClient("//localhost:6379");
subscriber.auth("YzRAdGgkFg");

subscriber.on("message", function (channel, message) {
  let msgg = JSON.parse(message);

  if (msgg.guid == userid) {
    console.log(msgg);
    send(msgg.tgmsg);
  }
});

subscriber.subscribe("tgpost");

bot.on('message', (msg) => {
  bot.sendMessage(msg.chat.id, "CHAT ID: " + msg.chat.id);
});

// Enable graceful stop
process.once('SIGINT', () => bot.stop('SIGINT'))
process.once('SIGTERM', () => bot.stop('SIGTERM'))
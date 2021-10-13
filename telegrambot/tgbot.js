
const fs = require("fs");
const redis = require("redis");
const TelegramBot = require('node-telegram-bot-api');

//hardcore
let chatid = Number(fs.readFileSync('chatid')) || 0;
console.log("chatid:" + chatid);
const tgkey = process.env.TELEGRAM_BOT_TOKEN;
const userid = process.env.GOOGLEUID;

//const userid = "d3fmoh2rVoVNgIcpLTFZBE0jHnI2";
//const tgkey = "2080569073:AAFbriREPchioL2nLd9szAGWbse9uMF8BEU";

if (tgkey === undefined) {
  throw new TypeError('BOT_TOKEN must be provided!')
}
const bot = new TelegramBot(tgkey);

bot.on('message', (msg) => {
  const chatId = msg.chat.id;
  console.log(chatId);
  bot.sendMessage(chatId, chatId);
  //fs.writeFileSync('chatid', chatId);
    

});




var subscriber = redis.createClient("//redis:6379");
subscriber.auth("YzRAdGgkFg");

function send(msg){
  let msgg = JSON.parse(msg);
  bot.sendMessage(chatid, msgg.d);
}

subscriber.on("message", function (channel, message) {

  send(message);
});


subscriber.subscribe("tgpost");

//const client = redis.createClient("//redis:6379");
//client.auth("YzRAdGgkFg");

//const userid = process.env.GOOGLEUID;






// Enable graceful stop
process.once('SIGINT', () => bot.stop('SIGINT'))
process.once('SIGTERM', () => bot.stop('SIGTERM'))
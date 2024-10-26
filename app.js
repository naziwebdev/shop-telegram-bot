const { Telegraf} = require("telegraf");
const configs = require("./configs");
const { mainMenue } = require("./utils/Menues");

const token = configs.telegramToken;

const bot = new Telegraf(token);

bot.start((ctx) => {
  mainMenue(ctx);
});

bot.launch();

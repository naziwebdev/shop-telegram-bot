const { Telegraf, Markup } = require("telegraf");
const configs = require("./configs");
const { mainMenu, buyMenu, choiceCountMenu } = require("./utils/Menues");

const token = configs.telegramToken;

const bot = new Telegraf(token);

let discountCount = 1;
let name;
let price;

bot.start((ctx) => {
  mainMenu(ctx);
});

bot.hears("خرید محصول 🛍️", (ctx) => {
  buyMenu(ctx);
});

//this must be above the callback_query otherwise dont work
bot.action("menu", (ctx) => {
  buyMenu(ctx);
});

bot.action("plus", (ctx) => {
  discountCount = discountCount + 1;
  choiceCountMenu(ctx, name, price, discountCount);
});

bot.action("minus", (ctx) => {
  discountCount = discountCount - 1;
  choiceCountMenu(ctx, name, price, discountCount);
});

bot.on("callback_query", (ctx) => {
  const cammand = ctx.callbackQuery.data;
  const actions = ["meat", "fruit", "food", "sweet"];

  switch (cammand) {
    case "meat":
      name = "پروتیین";
      price = 4000;
      break;
    case "fruit":
      name = "میوه";
      price = 3000;
      break;
    case "food":
      name = "غذا";
      price = 6000;
      break;
    case "sweet":
      name = "شیرینی";
      price = 5000;
      break;
    default:
      name = "محصول";
      price = 0;
  }

  if (actions.includes(cammand)) {
    choiceCountMenu(ctx, name, price, discountCount);
  }
});

bot.launch();

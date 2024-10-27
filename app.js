const { Telegraf, Markup } = require("telegraf");
const configs = require("./configs");
const { mainMenu, buyMenu, choiceCountMenu } = require("./utils/Menues");
const { hintMessage } = require("./messages");
const token = configs.telegramToken;

const bot = new Telegraf(token);

//var for choice count of product
let discountCount = 1;
let name;
let price;

//start
bot.start((ctx) => {
  mainMenu(ctx);
});

//send products list keyborad menu
bot.hears("خرید محصول 🛍️", (ctx) => {
  buyMenu(ctx);
});

//send hint message
bot.hears("راهنما ✅", (ctx) => {
  ctx.reply(hintMessage);
});

bot.hears("پشتیبانی 💁‍♀️", (ctx) => {
  ctx.reply("پیام خود را برای پشتیبان ارسال نمایید :");
});

bot.on("text", (ctx) => {
  const userMessage = ctx.message.text;
  ctx.reply("پیام شما با موفقیت دریافت شد 📩");
});

//this must be above the callback_query otherwise dont work
//send buy keyboard menu
bot.action("menu", (ctx) => {
  buyMenu(ctx);
});

// plus count of product when buy
bot.action("plus", (ctx) => {
  discountCount = discountCount + 1;
  choiceCountMenu(ctx, name, price, discountCount);
});

// minus count of product when buy
bot.action("minus", (ctx) => {
  discountCount = discountCount - 1;
  choiceCountMenu(ctx, name, price, discountCount);
});

//send choice count of product keyboard menu
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

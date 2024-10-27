const { Telegraf, Markup } = require("telegraf");
const configs = require("./configs");
const redis = require("./redis");
const { mainMenu, buyMenu, choiceCountMenu } = require("./utils/Menues");
const {
  registerUser,
  adminGetPassword,
  adminSetPassword,
  loginAdminGetPassword,
  loginAdmin,
} = require("./ActionsBot/userActions");
const { hintMessage } = require("./messages");

const token = configs.telegramToken;

const bot = new Telegraf(token);

//var for choice count of product
let discountCount = 1;
let name;
let price;

//start
bot.start(async (ctx) => {
  await registerUser(ctx);
  mainMenu(ctx);
});

//admin set password
bot.command("setPassword", async (ctx) => {
  await adminGetPassword(ctx);
});

//get password for login admin
bot.command("admin", async (ctx) => {
  await loginAdminGetPassword(ctx);
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

bot.on("text", async (ctx) => {
  const chatId = ctx.chat.id;
  const userMessage = ctx.message.text;
  const isPasswordAdminMessage = await redis.get(`admin:${chatId}`);
  const isLoginPasswordAdminMessage = await redis.get(`admin:${chatId}:login`);

  //set admin password in db
  if (isPasswordAdminMessage && !userMessage.startsWith("/")) {
    await redis.del(`admin:${chatId}`);
    await adminSetPassword(ctx, userMessage);
  }

  //login admin
  if (isLoginPasswordAdminMessage && !userMessage.startsWith("/")) {
    await redis.del(`admin:${chatId}:login`);
    await loginAdmin(ctx, userMessage);
  }

  if (
    !userMessage.startsWith("/") &&
    !isPasswordAdminMessage &&
    !isLoginPasswordAdminMessage
  ) {
    ctx.reply("پیام شما با موفقیت دریافت شد 📩");
  }
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

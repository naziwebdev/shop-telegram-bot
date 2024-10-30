const { Telegraf } = require("telegraf");
const configs = require("./configs");
const redis = require("./redis");
const axios = require("axios");
const { mainMenu, buyMenu, confirmMenu } = require("./utils/Menues");
const {
  registerUser,
  adminGetPassword,
  adminSetPassword,
  loginAdminGetPassword,
  loginAdmin,
} = require("./ActionsBot/userActions");

const {
  addProduct,
  removeProduct,
  findOneProduct,
} = require("./ActionsBot/productActions");

const {
  createOrder,
  findOneOrder,
  updateStatusPayOrder,
} = require("./ActionsBot/orderActions");
const { hintMessage } = require("./messages");

const token = configs.telegramToken;

const bot = new Telegraf(token);

//global variables

//var for choice count of product
let discountCount = 1;
//name of product for search in db , ...
let name;
//price of product for search in db , ...
let price;
//product that user want to buy
let product;
//flag for detect add product text from another text in text event
let isWaitForAddProductInfo = false;
//flag for detect remove product text from another text in text event
let isWaitForRemoveProductInfo = false;

//start
bot.start(async (ctx) => {
  const payload = ctx.payload;

  //if user have  order and payment for complete user order
  if (payload) {
    if (product) {
      const order = await findOneOrder(product.id, payload);
      
      const request = await axios.post("https://gateway.zibal.ir/v1/verify", {
        merchant: "zibal",
        trackId:order[0].track_id
      });

      if (request.data.result == 100) {
        await updateStatusPayOrder(ctx, order,product);
      } else {
        ctx.reply("تراکنش ناموفق ❌");
      }
    }

  } else {
    await registerUser(ctx);
    mainMenu(ctx);
  }
});

//admin set password
bot.command("setPassword", async (ctx) => {
  await adminGetPassword(ctx);
});

//get password for login admin
bot.command("admin", async (ctx) => {
  await loginAdminGetPassword(ctx);
});

//add product by admin
bot.command("add", async (ctx) => {
  ctx.reply(
    "نام و مبلغ محصول را وارد کنید و بین نام و مبلغ از خط تیره استفاده کنید\n مثال : میوه - 5000"
  );

  isWaitForAddProductInfo = true;
});

//remove product by admin
bot.command("remove", async (ctx) => {
  ctx.reply(
    "نام و مبلغ محصول مورد نظر را به صورت \n میوه - 3000 \n  وارد کنید و مبلغ حتما با اعداد انگلیسی وارد شود"
  );

  isWaitForRemoveProductInfo = true;
});

//send products list keyborad menu
bot.hears("خرید محصول 🛍️", (ctx) => {
  buyMenu(ctx);
});

//send hint message
bot.hears("راهنما ✅", (ctx) => {
  ctx.reply(hintMessage);
});

//not develope yet
bot.hears("پشتیبانی 💁‍♀️", (ctx) => {
  ctx.reply("coming soon ...");
});

//not develope yet
bot.hears("حساب کاربری 👤", (ctx)=> {
  ctx.reply("coming soon ...");
})

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

  //add product to db by admin
  if (isWaitForAddProductInfo) {
    const productInfo = userMessage.split("-");
    await addProduct(ctx, productInfo[0], productInfo[1]);
    isWaitForAddProductInfo = false;
  }

  if (isWaitForRemoveProductInfo) {
    const productInfo = userMessage.split("-");
    await removeProduct(ctx, productInfo[0], productInfo[1]);
    isWaitForRemoveProductInfo = false;
  }
});

//this must be above the callback_query otherwise dont work
//send buy keyboard menu
bot.action("menu", (ctx) => {
  buyMenu(ctx);
});


// accept order and create order in db
bot.action("accept", async (ctx) => {
  await createOrder(ctx, product);
});

//send choice count of product keyboard menu
bot.on("callback_query", async (ctx) => {
  const command = ctx.callbackQuery.data;
  const actions = ["meat", "fruit", "food", "sweet"];

  product = await findOneProduct(command);

  switch (command) {
    case "meat":
      name = product.title;
      price = product.price;
      break;
    case "fruit":
      name = product.title;
      price = product.price;
      break;
    case "food":
      name = product.title;
      price = product.price;
      break;
    case "sweet":
      name = product.title;
      price = product.price;
      break;
    default:
      name = "محصول";
      price = 0;
  }

  if (actions.includes(command)) {
    confirmMenu(ctx, name, price, discountCount);
  }
});

bot.launch();

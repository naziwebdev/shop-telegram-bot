const { Markup } = require("telegraf");
const { getProduct } = require("../ActionsBot/productActions");

const mainMenu = (ctx) => {
  ctx.reply(
    "سلام به ربات دریافت کد تخفیف خوش آمدید  ❤️ \n در صورت هر گونه سو استفاده از ربات  دسترسی شما مسدود خواهد شد ✖️",
    Markup.keyboard([
      ["خرید محصول 🛍️"],
      ["پشتیبانی 💁‍♀️", "حساب کاربری 👤"],
      ["راهنما ✅"],
    ])
  );
};

const buyMenu = async (ctx) => {
  const products = await getProduct();

  const buttons = products.map((product) => {
    const callbackData =
      product.title.trim() === "شیرینی"
        ? "sweet"
        : product.title.trim() === "گوشت"
        ? "meat"
        : product.title.trim() === "غذا"
        ? "food"
        : product.title.trim() === "میوه"
        ? "fruit"
        : "default";
    return [
      Markup.button.callback(
        `${product.title}-${product.price} ت 💫`,
        callbackData
      ),
    ];
  });

  ctx.reply("محصول مورد نظر را انتخاب کنید :", Markup.inlineKeyboard(buttons));
};

const choiceCountMenu = (ctx, name, price, count) => {
  ctx.editMessageText(
    `خرید کد ${name} به مبلغ : ${price} تومان \n تعداد: ${count} `,
    Markup.inlineKeyboard([
      [
        Markup.button.callback("تایید خرید ✅", "accept"),
        Markup.button.callback("منو اصلی 🏠", "menu"),
      ],
    ])
  );
};

module.exports = { mainMenu, buyMenu, choiceCountMenu };

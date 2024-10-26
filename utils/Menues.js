const { Markup } = require("telegraf");

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

const buyMenu = (ctx) => {
  ctx.reply(
    "محصول مورد نظر را انتخاب کنید :",
    Markup.inlineKeyboard([
      [Markup.button.callback(" کد پروتئین 🍗", "meat")],
      [Markup.button.callback("کد میوه 🍏", "fruit")],
      [Markup.button.callback("کد غذا 🍕", "food")],
      [Markup.button.callback("کد شیرینی 🧁", "sweet")],
    ])
  );
};

const choiceCountMenu = (ctx, name, price) => {
  ctx.editMessageText(
    `خرید کد${name} به مبلغ : ${price} تومان\n تعداد را مشخص کنید \n تعداد:1 `,
    Markup.inlineKeyboard([
      [
        Markup.button.callback("+1", "plus"),
        Markup.button.callback("-1", "minus"),
      ],
      [
        Markup.button.callback("تایید خرید ✅", "accept"),
        Markup.button.callback("منو اصلی 🏠", "menu"),
      ],
    ])
  );
};

module.exports = { mainMenu, buyMenu, choiceCountMenu };

const { Markup } = require("telegraf");

const mainMenue = (ctx) => {
  ctx.reply(
    "سلام به ربات دریافت کد تخفیف خوش آمدید  ❤️ \n در صورت هر گونه سو استفاده از ربات  دسترسی شما مسدود خواهد شد ✖️",
    Markup.keyboard([
      [Markup.button.callback("خرید محصول 🛍️", "buy")],
      [
        Markup.button.callback("پشتیبانی 💁‍♀️", " support"),
        Markup.button.callback("حساب کاربری 👤", "account"),
      ],
      [Markup.button.callback("راهنما ✅", "guide")],
    ])
  );
};

module.exports = { mainMenue };

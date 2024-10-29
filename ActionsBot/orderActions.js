const { Markup } = require("telegraf");
const db = require("../db");
const { findByChatId } = require("./userActions");
const axios = require("axios");

const createOrder = async (ctx, product) => {
  try {
    if (product === undefined) {
      ctx.editMessageText("مشکلی رخ داد ! از اول محصول را انتخاب کنید ⚠️");
    } else {
      const user = await findByChatId(ctx);

      const [existDiscount] = await db.execute(
        "SELECT * FROM products WHERE used = 0 AND title = ?",
        [product.title]
      );


      if (existDiscount.length !== 0) {
        //peymant req
        const request = await axios.post(
          "https://gateway.zibal.ir/v1/request",
          {
            merchant: "zibal",
            amount: product.price * 10,
            callbackUrl: `https://t.me/discountPr_bot?start=${user.id}`,
          }
        );


        if (request.data.message === "success") {
          const trackId = request.data.trackId;
          const query =
            "INSERT INTO orders (product_id,user_id,track_id) VALUES (?,?,?)";
          await db.execute(query, [product.id, user.id, trackId]);

          ctx.reply(
            "برای پرداخت روی دکمه زیر کلیک کنید : و برای تکمیل خرید به ربات برگشته و start را بزنید 🛑",
            Markup.inlineKeyboard([
              Markup.button.url(
                "ورود به درگاه پرداخت",
                `https://gateway.zibal.ir/start/${trackId}`
              ),
            ])
          );
        } else {
          ctx.editMessageText("مشکلی رخ داد ! از اول محصول را انتخاب کنید ⚠️");
        }
      } else {
        ctx.reply("محصولی موجود نیست ❌");
      }
    }
  } catch (error) {
    throw error;
  }
};

const findOneOrder = async (productID, userID) => {
  try {
    const query =
      "SELECT * FROM orders WHERE product_id = ? AND user_id = ? ORDER BY id DESC LIMIT 1";

    const [order] = await db.execute(query, [productID, userID]);

    return order;
  } catch (error) {
    throw error;
  }
};

const getRandomDiscountKey = async () => {
  try {
    const [discount] = await db.execute(
      "SELECT * FROM products WHERE used = 0 ORDER BY RAND() LIMIT 1"
    );

    await db.execute("UPDATE products SET used = 1 WHERE id = ?", [
      discount[0].id,
    ]);

    return discount[0].discount_key;
  } catch (error) {
    throw error;
  }
};

const updateStatusPayOrder = async (ctx, order) => {
  try {
    const query = "UPDATE orders SET status_pay = ? WHERE id=?";
    await db.execute(query, ["done", order[0].id]);
    const discount = await getRandomDiscountKey();

    ctx.reply(`کد تخفیف شما 😍 : \n ${discount}`);
  } catch (error) {
    throw error;
  }
};

module.exports = { createOrder, findOneOrder, updateStatusPayOrder };

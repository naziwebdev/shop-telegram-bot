const { isLoginAdmin } = require("./userActions");
const db = require("../db");
const { v4: uuidv4 } = require("uuid");

const addProduct = async (ctx, title, price) => {
  const isLogin = await isLoginAdmin(ctx);

  if (isLogin) {
    const discountKey = uuidv4().replace(/-/g, "").slice(0, 10);

    const query =
      "INSERT INTO products (title,price,discount_key) VALUES (?,?,?)";

    await db.execute(query, [title, price, discountKey]);

    ctx.reply("محصول با موفقیت افزوده شد ✅");
  } else {
    ctx.reply("ابتدا لاگین کنید ⚠️");
  }
};

module.exports = { addProduct };

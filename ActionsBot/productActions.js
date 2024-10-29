const { isLoginAdmin } = require("./userActions");
const db = require("../db");
const { v4: uuidv4 } = require("uuid");

const addProduct = async (ctx, title, price) => {
  try {
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
  } catch (error) {
    throw error;
  }
};

const getProduct = async () => {
  try {
    const query = "SELECT * FROM products GROUP BY title,price";

    const products = await db.execute(query);

    return products[0];
  } catch (error) {
    throw error;
  }
};

const removeProduct = async (ctx, title, price) => {
  try {
    const isLogin = await isLoginAdmin(ctx);

    if (isLogin) {
      const query = "DELETE FROM products WHERE price = ? AND title LIKE ?";

      await db.execute(query, [price, `%${title}%`]);

      ctx.reply(`${title}-${price} با موفقیت حذف شد 🚮`);
    } else {
      ctx.reply("ابتدا لاگین کنید ⚠️");
    }
  } catch (error) {
    throw error;
  }
};

const findOneProduct = async (action) => {
  try {
    const productTitle =
      action === "sweet"
        ? "شیرینی"
        : action === "meat"
        ? "گوشت"
        : action === "food"
        ? "غذا"
        : action === "fruit"
        ? "میوه"
        : "default";

    const query =
      "SELECT * FROM products WHERE title LIKE ? GROUP BY title,price ";

    const [product] = await db.execute(query, [`%${productTitle}%`]);

    return product[0];
  } catch (error) {
    throw error;
  }
};

module.exports = { addProduct, getProduct, removeProduct, findOneProduct };

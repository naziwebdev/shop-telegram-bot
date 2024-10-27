const { Markup } = require("telegraf");
const db = require("../db");
const bcrypt = require("bcryptjs");
const redis = require("../redis");

const registerUser = async (ctx) => {
  try {
    const chatId = ctx.chat.id;
    const name = ctx.chat.first_name;

    const existUserQuery = "SELECT * FROM users WHERE chat_id = ?";
    const [existUser] = await db.execute(existUserQuery, [chatId]);

    if (existUser.length == 0) {
      const registerQuery = "INSERT INTO users (name,chat_id) VALUES (?,?)";
      await db.execute(registerQuery, [name, chatId]);
    }
  } catch (error) {
    throw error;
  }
};

const adminGetPassword = async (ctx) => {
  try {
    const chatId = ctx.chat.id;

    const userQuery =
      'SELECT * FROM users WHERE chat_id = ? AND role = "admin"';
    const [user] = await db.execute(userQuery, [chatId]);

    if (user) {
      //set this till in bot.on('text') can seperate get password from another text
      await redis.set(`admin:${chatId}`, "verify", "EX", 60);

      ctx.reply(
        "پسورد خود را وارد کنید که ترکیبی از حروف بزرگ و کوچک و اعداد باشد و حداقل ۸ رقم باشد :"
      );
    }
  } catch (error) {
    throw error;
  }
};

const adminSetPassword = async (ctx, password) => {
  try {
    const chatId = ctx.chat.id;

    const regex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/;
    const isValidFormmatPasswprd = regex.test(password);

    if (isValidFormmatPasswprd) {
      const userQuery = "SELECT * FROM users WHERE chat_id = ?";
      const [user] = await db.execute(userQuery, [chatId]);

      const hashedPassword = await bcrypt.hash(password, 10);

      await db.execute("INSERT INTO admin_passwords  VALUES (NULL,?,?)", [
        hashedPassword,
        user[0].id,
      ]);
      ctx.reply("پسورد با موفقیت ثبت شد ✅");
    } else {
      ctx.reply("پسورد باید ۸ رقم و حاوی حروف بزرگ و کوچک و اعداد باشد ❌");
    }
  } catch (error) {
    throw error;
  }
};

const loginAdminGetPassword = async (ctx) => {
  try {
    const chatId = ctx.chat.id;
    const getAdminQuery =
      'SELECT * FROM users WHERE chat_id = ? AND role = "admin"';
    const [admin] = await db.execute(getAdminQuery, [chatId]);

    if (admin) {
      //set this till in bot.on('text') can seperate get password from another text
      await redis.set(`admin:${chatId}:login`, "verify", "EX", 60);
      ctx.reply("پسورد خود را وارد کنید ؛");
    } else {
      ctx.reply("شما ادمین نیستید !");
    }
  } catch (error) {
    throw error;
  }
};

const loginAdmin = async (ctx, password) => {
  try {
    const chatId = ctx.chat.id;
    const getAdminQuery =
      'SELECT * FROM users WHERE chat_id = ? AND role = "admin"';
    const [admin] = await db.execute(getAdminQuery, [chatId]);

    const [adminPassword] = await db.execute(
      "SELECT * FROM admin_passwords WHERE user_id=?",
      [admin[0].id]
    );

    const isValidPassword = await bcrypt.compare(
      password,
      adminPassword[0].password
    );

    if (isValidPassword) {
      await redis.set(`admin:${chatId}:login:success`, "true", "EX", 604800);
      ctx.reply("با موفقیت لاگین شدید ✅");
    } else {
      ctx.reply("شکست در لاگین ❌");
    }
  } catch (error) {
    throw error;
  }
};

module.exports = {
  registerUser,
  adminGetPassword,
  adminSetPassword,
  loginAdminGetPassword,
  loginAdmin,
};

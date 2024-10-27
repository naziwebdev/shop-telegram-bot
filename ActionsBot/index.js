const { Markup } = require("telegraf");
const db = require("../db");

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

module.exports = { registerUser };

const db = require("../db");
const fs = require("fs");
const path = require("path");

const migration = async () => {
  const connection = await db.getConnection();

  const createUsersTableSql = fs.readFileSync(
    path.resolve(__dirname, "./users-ddl.sql"),
    "utf-8"
  );

  const createProductsTableAql = fs.readFileSync(
    path.resolve(__dirname, "./products-ddl.sql"),
    "utf8"
  );

  const createAdminPasswordsTableSql = fs.readFileSync(
    path.resolve(__dirname, "./admin-passwords-ddl.sql"),
    "utf8"
  );

  const createOrdersTableSql = fs.readFileSync(
    path.resolve(__dirname, "./orders-ddl.sql"),
    "utf8"
  );

  await connection.beginTransaction();

  try {
    await connection.query(createUsersTableSql);
    await connection.query(createAdminPasswordsTableSql);
    await connection.query(createProductsTableAql);
    await connection.query(createOrdersTableSql);

    await connection.commit();
  } catch (error) {
    console.log(error);
    await connection.rollback();
  }
};

migration()
  .then(() => console.log("migrations ran successfully"))
  .catch(async (err) => {
    console.log(err);
    await db.end();
  });

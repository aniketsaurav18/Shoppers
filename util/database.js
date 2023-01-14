const Sequelize = require("sequelize");

const sequilize = new Sequelize("node-complete", "root", "123456", {
  dialect: "mysql",
  host: "localhost",
});

module.exports = sequilize;

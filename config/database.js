const mongoose = require("mongoose");

require("dotenv").config();

const dbConnection = (database_name) => {
  mongoose
    .connect(process.env.DATABASE_URL + database_name)
    .then(() => {
      console.log("Name of Connected database: " + database_name);
    })
    .catch((err) => {
      console.log("Error connecting to datbase");
      console.error(err.message);
      process.exit(1);
    });
};

module.exports = dbConnection;

const mongoose = require("mongoose");

const mongoString = process.env.DATABASE_URL;
mongoose.connect(mongoString, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
const dataBase = mongoose.connection;
dataBase.on("error", (error) => {
  console.log(error);
});

dataBase.once("connected", () => {
  console.log("Database Connected");
});

module.exports = dataBase;

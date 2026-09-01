const mongoose = require("mongoose");

const initializeDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("Connected Successfully");
  } catch (error) {
    console.log("Connection Failed", error);
  }
};

module.exports = { initializeDatabase };
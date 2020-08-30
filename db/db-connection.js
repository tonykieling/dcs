/**
 * db connection
 */ 
const mongoose    = require("mongoose");
require('dotenv').config();

const connect = () => {
  try {
    mongoose.connect(process.env.DB, { 
      useNewUrlParser: true,
      useUnifiedTopology: true })
      .then(z => console.log(" => MongoDB connection success!"))
      .catch(error => console.log("error:", error.message));

  } catch (err) {
    console.log("error on MongoDB connection: ", err);
  }
};

module.exports = {
  connect
};
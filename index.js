// const express     = require("express");
// const PORT        = process.env.PORT || 3456;
// const path        = require('path');
// const app         = express();
// const morgan      = require("morgan");
// const bodyParser  = require("body-parser");
const mongoose    = require("mongoose");
require('dotenv').config();

// const userRoutes      = require("./api/routes/user.js");
// const clientRoutes    = require("./api/routes/client.js");
// const clockinRoutes   = require("./api/routes/clockin.js");
// const invoiceRoutes   = require("./api/routes/invoice.js");
console.log("test")


// const connection = () => {
  try {
    mongoose.connect(process.env.DB, { 
      useNewUrlParser: true,
      useUnifiedTopology: true })
      .then(e => console.log(e))

    // console.log("conn=> ", conn.then());
  } catch (err) {
    console.log("error on MongoDB connection");
    console.log(err.message);
  }
// }

// console.log(connection())

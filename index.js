"use strict";

const express       = require("express");
const PORT          = process.env.PORT || 3456;
const session       = require('express-session');
const cookieParser  = require('cookie-parser');
const logger        = require('morgan');
const app           = express();
const bodyParser    = require("body-parser");
require('dotenv').config();

const firstMessage  = require("./message/first-message.js");
const conversation  = require("./message/conversation.js");

const db = require("./db/db-connection.js");
db.connect();

app.use(logger('dev')); //temp dev purpose

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

app.use(session({
  secret: process.env.SESSIONSECRET,
  cookie: { maxAge: 36000000 }, //10 hours
  resave: false,
  saveUninitialized: true,
}));

// this is the route for the very first message
app.use("/firstMessage", firstMessage);


// this is the route for all messages exchanges after firstMessage
app.use("/conversation", conversation);


app.listen(PORT, () => {
  console.log(`Express server listening on port ${PORT}`);
});

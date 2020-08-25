// const express     = require("express");
const PORT        = process.env.PORT || 3456;
// const path        = require('path');
// const app         = express();
// const morgan      = require("morgan");
// const bodyParser  = require("body-parser");

const mongoose    = require("mongoose");
require('dotenv').config();

try {
  mongoose.connect(process.env.DB, { 
    useNewUrlParser: true,
    useUnifiedTopology: true })
    .then(z => console.log(" => MongoDB connection success!"))
    .catch(error => console.log("error:", error.message));

} catch (err) {
  console.log("error on MongoDB connection: ", err);
}


const express = require('express');
const session = require('express-session');
const MessagingResponse = require('twilio').twiml.MessagingResponse;

const app = express();

app.use(session({secret: 'anything-you-want-but-keep-secret'}));

app.post('/sms', (req, res) => {
  console.log("req==>", req);

  const smsCount = req.session.counter || 0;

  let message = 'Hello, thanks for the new message.';

  if(smsCount > 0) {
    message = 'Hello, thanks for message number ' + (smsCount + 1);
  }

  req.session.counter = smsCount + 1;

  const twiml = new MessagingResponse();
  twiml.message(message);

  res.writeHead(200, {'Content-Type': 'text/xml'});
  res.end(twiml.toString());
});


app.listen(PORT, () => {
  console.log(`Express server listening on port ${PORT}`);
});

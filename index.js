const express       = require("express");
const PORT          = process.env.PORT || 3456;
const session       = require('express-session');
const cookieParser  = require('cookie-parser');
const logger        = require('morgan');
const app           = express();
const bodyParser    = require("body-parser");

const firstMessage  = require("./message/first-message.js");
// const conversation  = require

const db = require("./db/db-connection.js");
db.connect();

app.use(logger('dev')); //temp dev purpose

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

app.use(session({
  secret: 'it-supposed-to-Be-a-$tr0ng_and_secret-Word', 
  cookie: { maxAge: 60000 },
  resave: false,
  saveUninitialized: true,
}));

app.use("/firstMessage", firstMessage);

// app.use("/conversation", );

app.listen(PORT, () => {
  console.log(`Express server listening on port ${PORT}`);
});


/*
// this is the interface which talks to twilio, and in its turn they talk to the debtors
app.post('/sms', (req, res) => {
  console.log("req==>", req.body);

  const MessagingResponse = require('twilio').twiml.MessagingResponse;

  const textReceived = req.body.Body;
  const smsCount = req.session.counter || 1;

  let message = "";

  switch(Number(smsCount)) {
    case 1:

      if (textReceived === "111") {
        message = "This is after first DEBTOR answer.\n Second question? \n(Please reply Yes(y) or No(n))";
        req.session.counter = smsCount + 1;
      } else
        message = "Please, answer 111 or 222"
      break;

    case 2:
      message = "This is after second answer.\n THIRD question? \n(Please reply Yes(y) or No(n))";
      break;

    case 3:
      message = "This is after THIRD answer.\n This is forth question? \n(Please reply Yes(y) or No(n))";
      break;

    default:
      console.log("Ops, none of the above. :/");
  }

  const twiml = new MessagingResponse();
  twiml.message(message);
  
  res.writeHead(200, {'Content-Type': 'text/xml'});
  res.end(twiml.toString());
});
*/





/**
 * one way of receiving and reply message through node
 * need to understand how to get the history of the conversation
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
*/


/**
 * this way is possible to query Twilio the messages in their db
 *
// Load configuration information from system environment variables.
const TWILIO_ACCOUNT_SID  = process.env.TWILIO_ACCOUNT_SID,
      TWILIO_AUTH_TOKEN   = process.env.TWILIO_AUTH_TOKEN,
      TWILIO_PHONE_NUMBER = process.env.TWILIO_PHONE_NUMBER;

// Create an authenticated client to access the Twilio REST API
const client = require("twilio")(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN);
// const client = require('twilio')(accountSid, authToken);


client.messages.list({limit: 20})
  .then(messages => messages.forEach(m => console.log(m)));
*/


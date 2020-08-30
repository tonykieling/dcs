/**
 * this is the method to trigger messages to twilio devilery for the debtors
*/ 

'use strict';

const express     = require('express'), 
      router      = express.Router(), 
      twilio      = require('twilio'),
      getDebtors  = require("../db/get-debtors.js");
require('dotenv').config();


router.post("/", async(req, res) => {
  console.log("1 - this is start!!!!");

  const allDebtors = await getDebtors.getAll();
  // console.log("allDebtors", allDebtors);

  // Load configuration information from system environment variables.
  const TWILIO_ACCOUNT_SID  = process.env.TWILIO_ACCOUNT_SID,
        TWILIO_AUTH_TOKEN   = process.env.TWILIO_AUTH_TOKEN,
        TWILIO_PHONE_NUMBER = process.env.TWILIO_PHONE_NUMBER;

  // Create an authenticated client to access the Twilio REST API
  const client = twilio(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN);

  for(let debtor of allDebtors.debtors) {
    console.log("This is debtor:", debtor);
    client.messages.create({
      to: debtor.phone,
      // to: "+17789389351",
      // from: TWILIO_PHONE_NUMBER,
      from: TWILIO_PHONE_NUMBER,
      body: `Hi ${debtor.name}.\nOn behalf of XYZ we want to talk to you about a debt of ${debtor.debt}.\nAre you available to chat?`
    }).then(function(message) {
      console.log("message::", message);
      // const cachedConversation = "1";
      // res.cookie("conversation", cachedConversation, { maxAge: 1000 * 60 * 60 });
      // When we get a response from Twilio, respond to the HTTP POST request
      res.send('Message is inbound!');
    });
  }
  return res.send({
    allDebtors,
    message: `SMS has been sent to the ${allDebtors.counter}`
  });
  
});

module.exports = router;
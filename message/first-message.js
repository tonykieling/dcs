/**
 * this is the method to trigger first message so twilio devilery them for the debtors
*/ 

"use strict";

const express     = require('express'), 
      router      = express.Router(), 
      twilio      = require('twilio'),
      getDebtors  = require("../db/get-debtors.js");
require('dotenv').config();


router.post("/", async(req, res) => {
  const allDebtors = await getDebtors.getAll();

  if (!allDebtors) return res.send({message: "No debtors at all in db!"});

  // Load Twilio configuration information from system environment variables.
  const TWILIO_ACCOUNT_SID  = process.env.TWILIO_ACCOUNT_SID,
        TWILIO_AUTH_TOKEN   = process.env.TWILIO_AUTH_TOKEN,
        TWILIO_PHONE_NUMBER = process.env.TWILIO_PHONE_NUMBER;

  // Create an authenticated client to access the Twilio REST API
  const client = twilio(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN);

  let countSuccessfullyMessages = 0;
  for(let debtor of allDebtors.debtors) {
    if ((debtor.name === "Bob") || (debtor.name === "Alice")) {
      try {
        const sendMessage = await client.messages.create({
          to: debtor.phone,
          from: TWILIO_PHONE_NUMBER,
          body: `\nHello ${debtor.name}.\nOn behalf of XYZ we want to talk to you about a debt of $${debtor.debt}.\n\nAre you able to pay it?`,
          // mymetadata: 1111111111 // it is NOT possible send a custom field using Twilio...
        });
        console.log(`\t### First message to ${debtor.name}, phone ${sendMessage.to}, debt = ${debtor.debt}`);
        countSuccessfullyMessages++;
      } catch(error){
        console.log(`\t!!! Error ===> Debtor = ${debtor.name}, ${debtor.phone}\n\t  Message ===> ${error.message}`);
      }
    }
  }

  return res.send({
    DebtorsLength: allDebtors.counter,
    DeliveredTo: `SMS has been sent to ${countSuccessfullyMessages} debtors`
  });
  
});

module.exports = router;
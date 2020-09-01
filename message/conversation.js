"use strict";

const express           = require('express'), 
      router            = express.Router(), 
      MessagingResponse = require('twilio').twiml.MessagingResponse;

// the last number here is the number of hours the cookie will be alive in the Twilio server
const cookieTimeAlive = 1000 * 60 * 60 * 1;

router.post("/", async(req, res) => {
  // console.log(" *********** inside conversation");
  // console.log("req.cookies.conversation", req.cookies.conversation)

  let conversationHistory = Number(req.cookies.conversation);
  const body = req.body.Body;
  // console.log(" ***** conversationHistory", conversationHistory);
  // console.log(" ***** req.body", req.body);

  const response = new MessagingResponse();

  if (!conversationHistory) {
    const from = req.body.From; // thius is phone number which is sending the message
    const twilio              = require('twilio'),
          TWILIO_ACCOUNT_SID  = process.env.TWILIO_ACCOUNT_SID,
          TWILIO_AUTH_TOKEN   = process.env.TWILIO_AUTH_TOKEN;
    const client              = twilio(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN);

    // let's grab info avout the last message sent to this phone number and
    // figure out what stage is the conversation
    // it should be the first reply message after receiving from our system OR
    // an answer for the above, but after Twilio cookie has expired - 4 hours (from Twilio documentation)
    const historyMessages = await client.messages
      .list({
        to: from,
        limit: 1
        // dateSent: new Date(Date.UTC(2020, 8, 30, 0, 0, 0)),
        // dateSentAfter: new Date(Date.UTC(2020, 7, 30, 21, 20, 0)), /// this is okay and = 2020-08-30T21:20:00.000Z
        // dateSentBefore: new Date(Date.UTC(2020, 8, 30, 0, 0, 0)),
      });

    console.log("NUmber of messages:", historyMessages.length);
    console.log("======================================\n historyMessages", historyMessages);

    if ((historyMessages[0].body.search("behalf") !== -1) || (historyMessages[0].body.search("can you send Yes"))) {
      conversationHistory = 1;
    } else if (historyMessages[0].body.search("Today") !== -1){
      conversationHistory = 2;
    } else {
      response.message(`\nSorry. Conversation was lost.\nPlease call 123-456-7890 for further information.`);
      return res.send(response.toString());
    }
  }


  let cachedConversation = "";
  switch (conversationHistory) {
    case 1:
      console.log(" --- Inside CASE 1");
      if ((body.toLowerCase() === "yes") 
          || (body.toLowerCase() === "y") 
          || (body.toLowerCase() === "yep")
          || (body.toLowerCase() === "sure")) {
        response.message(`\nGreat! \nI am assuming you are able to pay all the debt.\nDo you wanna pay by?\n Send\n  1 for Credit Card or \n  2 for Transferwise.`);
        cachedConversation = 2;
      } else if ((body.toLowerCase() === "no") 
          || (body.toLowerCase() === "nope") 
          || (body.toLowerCase() === "not really")) {
        response.message(`\nThank you for your honest answer.\nAny information, please call 123.`);
        res.clearCookie("conversation");
        res.type("text/xml");
        return res.send(response.toString());        
      } else {
        response.message(`\nI cannot understand what you mean.\n Please, can you send Yes if you are able to pay or No if not?`);
        cachedConversation = 1;
      }
      res.cookie("conversation", cachedConversation, { maxAge: cookieTimeAlive });
      break;

    case 2:
      console.log(" --- Inside CASE 22");
      if ((Number(body) === 1) || (Number(body) === 2)) {
        response.message(`\Awesome! \nPlease type \n1 for Today or \n2 for Tomorrow.`);
        cachedConversation = 3;
      } else {
        response.message(`\nI cannot understand what you mean.\n Please, \nDo you wanna pay by?\n Send\n  1 for Credit Card or \n  2 for Transferwise.`);
        cachedConversation = 2;
      }
      res.cookie("conversation", cachedConversation, { maxAge: cookieTimeAlive });
      break;

    case 3:
      console.log(" --- Inside CASE 333");
      if ((Number(body) === 1) || (Number(body) === 2)) {
        response.message(`\nAwesome! \nPlease Follow the instructions below: \n1, 2, 3....\nAny further information, please call 123.`);
        res.clearCookie("conversation");
        res.type("text/xml");
        return res.send(response.toString());
      } else {
        response.message(`\nPlease type \n1 for Today or \n2 for Tomorrow.`);
        cachedConversation = 3;
      }
      res.cookie("conversation", cachedConversation, { maxAge: cookieTimeAlive });
      break;

    default:
      console.log("Default!?!?!?!?!?!?!?!?");
      response.message("Default.... :/ Can you answer asd?");
      break;
  }
  
  res.type("text/xml");
  res.send(response.toString());
});

module.exports = router;
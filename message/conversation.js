"use strict";

const express           = require('express'), 
      router            = express.Router(), 
      MessagingResponse = require('twilio').twiml.MessagingResponse;

// the last number here is the number of hours the cookie will be alive in the Twilio server
const cookieTimeAlive = 1000 * 60 * 60 * 1;

router.post("/", async(req, res) => {
  console.log(" *********** inside conversation");
  console.log("req.cookies.conversation", req.cookies.conversation)

  const conversationHistory = Number(req.cookies.conversation);
  const body = req.body.Body;
  console.log(" ***** conversationHistory", conversationHistory);
  console.log(" ***** req.body", req.body);

  const response = new MessagingResponse();

  if (!conversationHistory) {
    response.message(`\nSorry. Conversation was lost.\nPlease call 123-456-7890 for further information.`);
    return res.send(response.toString());
  }


  
  let cachedConversation = "";
  switch (conversationHistory) {
    case 1:
      console.log(" --- Inside CASE 1");
      if ((Number(body) === 1) || (body.toLowerCase() === "yes") || (body.toLowerCase() === "y") || (body.toLowerCase() === "yep")) {
        response.message(`\nGreat! \nI am assuming you are able to pay all the debt.\nDo you wanna pay by?\n Send\n  1 for Credit Card or \n  2 for Transferwise.`);
        cachedConversation = 2;
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
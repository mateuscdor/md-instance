const port = process.argv[2];

// import { proto, WAMessage } from '@adiwajshing/baileys';

import { Instance } from '../app';

require('dotenv').config();
import express from 'express';
const router = express.Router();

// import fs from 'fs';
// import path from "path";
// const history = path.join("history", `${port}.store.json`);

// middlewares
import { authentication } from '../middlewares/auth';
import { connection } from '../middlewares/connection';
import { checkJsonMessageId } from '../middlewares/checkJson';
import { returnJid, checkJid } from '../middlewares/checkChat';

const middlewares = [connection, authentication];
const middlewaresA = [connection, authentication, checkJid];
const middlewaresB = [connection, authentication, checkJsonMessageId];

router.get("/getmessages", middlewares, async (req, res) => {

  const objMessages: any = { options: [], messages: [] };
  objMessages.options.push({ port: port });
  let objStore: any = { options: [], messages: [] };
  objStore.options.push({ port: port });
  const instance = Instance;
  const messages = instance.instances[port].instance.messages;

  if (messages) {
    messages.map((message) => {
      if (!message?.message?.protocolMessage) {
        objMessages.messages.push(message);
      }
    });
    return res.status(200).end(JSON.stringify(objMessages));
  } else {
    return res.status(200).end(JSON.stringify({ accountStatus: false, message: 'No messages found!' }));
  }

});

router.post("/getmessagesbyjid", middlewaresA, async (req, res) => {

  const jid = returnJid();
  const objMessages: any = { options: [] };
  objMessages.options.push({ port: port });
  const instance = Instance;
  const messages = instance.instances[port].instance.messages;

  if (messages) {
    const messages = instance.instances[port].getMessages(jid);
    const newMessages = await Object.assign(objMessages, { messages });
    return res.status(200).end(JSON.stringify(newMessages));
  } else {
    return res.status(200).end(JSON.stringify({ accountStatus: false, message: 'No messages found!' }));
  }

});

router.post("/getmessagebyid", middlewaresB, async (req, res) => {

  const data = req.body;
  const messageId = data.messageId;
  const objMessages: any = { options: [] };
  objMessages.options.push({ port: port });
  const instance = Instance;
  const messages = instance.instances[port].instance.messages;

  if (messages) {
    const messages = instance.instances[port].getMessageById(messageId);
    const newMessages = await Object.assign(objMessages, { messages });
    return res.status(200).end(JSON.stringify(newMessages));
  } else {
    return res.status(200).end(JSON.stringify({ accountStatus: false, message: 'No message found!' }));
  }

});

export default router;

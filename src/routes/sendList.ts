const port = process.argv[2];

import { delay } from '@adiwajshing/baileys';

import { Instance } from '../app';

import express from "express";
const router = express.Router();

// middlewares
import { connection } from '../middlewares/connection';
import { authentication } from '../middlewares/auth';
import { checkJsonList } from '../middlewares/checkJson';
import { returnJid, checkJid } from '../middlewares/checkChat';

const middlewares = [connection, authentication, checkJsonList, checkJid];

router.post("/sendlist", middlewares, async (req, res) => {
  const instance = Instance;
  const socket = instance.instances[port].instance.socket;
  const data = req.body;
  const jid = returnJid();
  const listMessage = {
    text: data.title ? data.title : undefined,
    footer: data.description ? data.description : undefined,
    buttonText: data.buttonText ? data.buttonText : undefined,
    listType: 'SINGLE_SELECT',
    sections: data.sections
  }
  await socket?.presenceSubscribe(jid);
  delay(500);
  await socket?.sendPresenceUpdate('composing', jid);
  delay(1000);
  let send = await socket?.sendMessage(jid, listMessage);
  let messageSent = await send;
  return res.send(JSON.stringify({ accountStatus: true, chatID: jid, messageID: messageSent?.key.id, message: "Message List sent successfully!" }));
});

export default router;

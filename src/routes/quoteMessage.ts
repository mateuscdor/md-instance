const port = process.argv[2];

import { delay } from '@adiwajshing/baileys';

import { Instance } from '../app';

import express from "express";
const router = express.Router();
import fs from 'fs';
import path from 'path';

// middlewares
import { connection } from '../middlewares/connection';
import { authentication } from '../middlewares/auth';
import { checkJsonQuoteMsg } from '../middlewares/checkJson';
import { returnJid, checkJid } from '../middlewares/checkChat';

const middlewares = [connection, authentication, checkJid, checkJsonQuoteMsg];

router.post("/quotemessage", middlewares, async (req, res) => {
  const instance = Instance;
  const socket = instance.instances[port].instance.socket;
  const data = req.body;
  let jid = returnJid();
  let key = data.key;
  let text = data.text;
  let message = data.message;

  await socket?.presenceSubscribe(jid);
  delay(500);
  await socket?.sendPresenceUpdate('composing', jid);
  delay(500);
  let send = socket?.sendMessage(jid, { text: text }, { quoted: { key, message } });
  let messageSent = await send;
  return res.send(JSON.stringify({ accountStatus: true, chatId: jid, messageId: messageSent?.key.id, message: "Message quoted successfully!" }));
});

export default router;

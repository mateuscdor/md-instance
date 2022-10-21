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
import { checkJsonForwardMsg } from '../middlewares/checkJson';
import { returnJid, checkJid } from '../middlewares/checkChat';

const middlewares = [connection, authentication, checkJid, checkJsonForwardMsg];

router.post("/forwardmessage", middlewares, async (req, res) => {
  const instance = Instance;
  const socket = instance.instances[port].instance.socket;
  const data = req.body;
  const jid = returnJid();
  const key = data.key;
  const message = data.message;

  await socket?.presenceSubscribe(jid);
  delay(500);
  await socket?.sendPresenceUpdate('composing', jid);
  delay(500);
  let send = socket?.sendMessage(jid, { forward: { key, message } });
  let messageSent = await send;
  return res.send(JSON.stringify({ accountStatus: true, chatId: jid, messageId: messageSent?.key.id, message: "Message forwarded successfully!" }));
});

export default router;

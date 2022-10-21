const port = process.argv[2];

import { delay } from '@adiwajshing/baileys';

import { Instance } from '../app';

import express from "express";
const router = express.Router();

// middlewares
import { connection } from '../middlewares/connection';
import { authentication } from '../middlewares/auth';
import { checkJsonDeleteMsg } from '../middlewares/checkJson';
import { returnJid, checkJid } from '../middlewares/checkChat';

const middlewares = [connection, authentication, checkJid, checkJsonDeleteMsg];

router.post("/deletemessage", middlewares, async (req, res) => {
  const instance = Instance;
  const socket = instance.instances[port].instance.socket;
  const data = req.body;
  let jid = returnJid();
  let key = data.key;
  delay(500);
  let send = socket?.sendMessage(jid, { delete: key });
  let messageSent = await send;
  return res.send(JSON.stringify({ accountStatus: true, chatId: jid, messageId: messageSent?.key.id, message: "Message deleted successfully!" }));
});

export default router;

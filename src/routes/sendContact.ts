const port = process.argv[2];

import { delay } from '@adiwajshing/baileys';

import { Instance } from '../app';

import express from "express";
const router = express.Router();

// middlewares
import { connection } from '../middlewares/connection';
import { authentication } from '../middlewares/auth';
import { checkJsonBody } from '../middlewares/checkJson';
import { returnJid, checkJid } from '../middlewares/checkChat';

const middlewares = [connection, authentication, checkJsonBody, checkJid];

router.post("/sendcontact", middlewares, async (req, res) => {
  const instance = Instance;
  const socket = instance.instances[port].instance.socket;
  let data = req.body;
  let vcard = data.body;
  let jid = returnJid();
  await socket?.presenceSubscribe(jid);
  delay(500);
  await socket?.sendPresenceUpdate('composing', jid);
  delay(1000);
  let send = socket?.sendMessage(jid, { contacts: { displayName: data.displayName, contacts: [{ vcard }] } });
  let messageSent = await send;
  return res.status(200).send(JSON.stringify({ accountStatus: true, chatID: jid, messageID: messageSent?.key.id, message: "Contact sent succesfully!" }));
});

export default router;

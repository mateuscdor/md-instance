const port = process.argv[2];

import { AnyMessageContent, delay } from '@adiwajshing/baileys';

import { Instance } from '../app';

import express from 'express';
const router = express.Router();

// middlewares
import { authentication } from '../middlewares/auth';
import { connection } from '../middlewares/connection';
import { checkJsonBody } from '../middlewares/checkJson';
import { returnJid, checkJid } from '../middlewares/checkChat';

const middlewares = [connection, authentication, checkJsonBody, checkJid];

router.post("/sendmessage", middlewares, async (req, res) => {
  const instance = Instance;
  const socket = instance.instances[port].instance.socket;

  const data = req.body;
  const jid = returnJid();

  await socket?.presenceSubscribe(jid);
  delay(500);
  await socket?.sendPresenceUpdate('composing', jid);
  delay(500);
  let send = socket?.sendMessage(jid, {
    text: data.body,
    contextInfo: {
      mentionedJid: data.mentioned ? data.mentioned : undefined
    }
  } as unknown as AnyMessageContent);

  const messageSent = await send;

  return res.status(200).send(JSON.stringify({
    accountStatus: true,
    chatId: jid,
    messageId: messageSent?.key.id,
    message: "Message sent successfully!"
  }));
});

export default router;

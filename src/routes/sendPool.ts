const port = process.argv[2];

import { proto, AnyMessageContent, delay, generateWAMessageFromContent, MessageGenerationOptionsFromContent, MessageRelayOptions } from '@adiwajshing/baileys';

import { Instance } from '../app';

import crypto from 'crypto';
const self = crypto.webcrypto;

import express from 'express';
const router = express.Router();

// middlewares
import { authentication } from '../middlewares/auth';
import { connection } from '../middlewares/connection';
import { checkJsonBody } from '../middlewares/checkJson';
import { returnJid, checkJid } from '../middlewares/checkChat';

const middlewares = [connection, authentication, checkJid];

router.post("/sendpool", middlewares, async (req: any, res: any) => {

  const instance = Instance;
  const socket = instance.instances[port].instance.socket;
  const data = req.body;
  const jid = returnJid();

  const pollCreationMessage = {
    // encKey: self.getRandomValues(new Uint8Array(32)),
    encKey: null,
    name: data.name,
    selectableOptionsCount: data.count,
    options: data.options
  }

  await socket?.presenceSubscribe(jid);
  delay(500);
  await socket?.sendPresenceUpdate('composing', jid);
  delay(500);

  const pollMessage = generateWAMessageFromContent(jid, proto.Message.fromObject({ "pollCreationMessage": pollCreationMessage }), {} as MessageGenerationOptionsFromContent);
  console.log(pollMessage)

  let send = socket?.relayMessage(jid, pollMessage?.message as proto.IMessage, { messageId: pollMessage.key.id } as MessageRelayOptions);

  const messageSent = await send;

  return res.status(200).send(JSON.stringify({
    accountStatus: true,
    chatId: jid,
    messageId: messageSent,
    message: "Message pool sent successfully!"
  }));
});

export default router;

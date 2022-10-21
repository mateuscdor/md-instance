const port = process.argv[2];

require('dotenv').config();
import express from "express";
const router = express.Router();

import { delay, downloadContentFromMessage } from '@adiwajshing/baileys';

import { Instance } from '../app';

// middlewares
import { connection } from '../middlewares/connection';
import { authentication } from '../middlewares/auth';

const middlewares = [connection, authentication];

router.post("/downloadmediamessage", middlewares, async (req, res) => {
  const instance = Instance;
  const socket = instance.instances[port].instance.socket;

  const data = req.body;
  const type = Object.keys(data.message[0].message)[0];
  const chat = data.message[0].key.remoteJid;
  const id = data.message[0].key.id;
  let stream, bodyBase64, mimeFile;
  if (type === 'imageMessage') {
    stream = await downloadContentFromMessage(data.message[0].message.imageMessage, 'image');
    mimeFile = data.message[0].message.imageMessage.mimetype;
  } else if (type === 'videoMessage') {
    stream = await downloadContentFromMessage(data.message[0].message.videoMessage, 'video');
    mimeFile = data.message[0].message.videoMessage.mimetype;
  } else if (type === 'stickerMessage') {
    stream = await downloadContentFromMessage(data.message[0].message.imageMessage, 'sticker');
    mimeFile = data.message[0].message.imageMessage.mimetype;
  } else if (type === 'audioMessage') {
    stream = await downloadContentFromMessage(data.message[0].message.audioMessage, 'audio');
    mimeFile = data.message[0].message.audioMessage.mimetype;
  } else if (type === 'documentMessage') {
    stream = await downloadContentFromMessage(data.message[0].message.documentMessage, 'document');
    mimeFile = data.message[0].message.documentMessage.mimetype;
  } else if (type === 'buttonMessage') {
    console.log('buttonMessage', data.message[0])
    let typeButton: string[] = Object.keys(data.message[0].message.viewOnceMessage.buttonMessage[0]);
    if (String(typeButton) === 'imageMessage') {
      stream = await downloadContentFromMessage(data.message[0].message.viewOnceMessage.buttonMessage.imageMessage, 'image');
      mimeFile = data.message[0].message.viewOnceMessage.buttonMessage.imageMessage.mimetype;
    } else if (String(typeButton) === 'videoMessage') {
      stream = await downloadContentFromMessage(data.message[0].message.viewOnceMessage.buttonMessage.videoMessage, 'video');
      mimeFile = data.message[0].message.viewOnceMessage.buttonMessage.videoMessage.mimetype;
    }
  }
  let buffer = Buffer.from([]);
  for await (const chunk of stream) {
    buffer = Buffer.concat([buffer, chunk]);
  }
  bodyBase64 = buffer.toString("base64");
  let mediaBase64 = `data:${mimeFile};base64,${bodyBase64}`;
  var objReceived: any = { options: [] };
  objReceived.options.push({ port: port });
  let objReceiveds = Object.assign(objReceived, { ...chat, ...id, mediaBase64 });
  await delay(1000);
  console.log('CONVERTEU MENSAGEM DE MEDIA TIPO:', type);
  return res.status(200).end(JSON.stringify(objReceiveds));
});

export default router;

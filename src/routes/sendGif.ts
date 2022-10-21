const port = process.argv[2];

import { delay } from '@adiwajshing/baileys';

import { Instance } from '../app';

import mime from 'mime-types';
import express from "express";
const router = express.Router();

// middlewares
import { connection } from '../middlewares/connection';
import { authentication } from '../middlewares/auth';
import { checkJsonBody } from '../middlewares/checkJson';
import { returnJid, checkJid } from '../middlewares/checkChat';

const middlewares = [connection, authentication, checkJsonBody, checkJid];

export const sendgif = router.post("/sendgif", middlewares, async (req, res) => {
  const instance = Instance;
  const socket = instance.instances[port].instance.socket;
  let statusAccount, typeMessage, messageTypeFile, fileName, typeFile, mimeFile;
  let data = req.body;
  let jid = returnJid();
  typeFile = mime.lookup(data.body);
  mimeFile = mime.extension(typeFile);
  if (data.filename) {
    fileName = data.filename;
  } else {
    fileName = Math.floor(Math.random() * 1000 * 1111111111111111) + "." + mimeFile;
  }
  if (typeFile == 'image/gif' || typeFile == 'video/mp4') {
    statusAccount = true;
    messageTypeFile = {
      video: { url: data.body },
      contextInfo: { mentionedJid: data.mentioned ? data.mentioned : undefined },
      viewOnce: data.viewOnce ? data.viewOnce : undefined,
      gifPlayback: true,
      mimetype: typeFile,
      caption: data.caption ? data.caption : "",
      fileName: data.filename ? data.filename : fileName
    };
    typeMessage = "Gif sent successfully!";
  } else {
    return res.status(200).end(JSON.stringify({ accountStatus: false, message: `Mime format '${typeFile}' not supported!` }));
  }
  await socket?.presenceSubscribe(jid);
  delay(500);
  await socket?.sendPresenceUpdate('composing', jid);
  delay(1000);
  let send = socket?.sendMessage(jid, messageTypeFile);
  let messageSent = await send;
  return res.status(200).send(JSON.stringify({ accountStatus: statusAccount, chatID: jid, messageID: messageSent?.key.id, message: typeMessage }));
});

export const sendgifbase64 = router.post("/sendgifbase64", middlewares, async (req, res) => {
  const instance = Instance;
  const socket = instance.instances[port].instance.socket;
  let statusAccount, typeMessage, messageTypeFile, fileName, typeFile, mimeFile, buffer;
  let data = req.body;
  let jid = returnJid();
  let base64Data = data.body.split("base64,")[1];
  buffer = Buffer.from(base64Data, 'base64');
  typeFile = data.body.replace(/.*data:(.*);base64,.*/, '$1');
  mimeFile = mime.extension(typeFile);
  if (data.filename) {
    fileName = data.filename;
  } else {
    fileName = Math.floor(Math.random() * 1000 * 1111111111111111) + "." + mimeFile;
  }
  if (typeFile == 'image/gif' || typeFile == 'video/mp4') {
    statusAccount = true;
    messageTypeFile = {
      video: buffer,
      contextInfo: { mentionedJid: data.mentioned ? data.mentioned : undefined },
      viewOnce: data.viewOnce ? data.viewOnce : undefined,
      gifPlayback: true,
      mimetype: typeFile,
      caption: data.caption ? data.caption : "",
      fileName: data.filename ? data.filename : fileName
    };
    typeMessage = "Gif sent successfully!";
  } else {
    return res.status(200).end(JSON.stringify({ accountStatus: false, message: `Mime format '${typeFile}' not supported!` }));
  }
  await socket?.presenceSubscribe(jid);
  delay(500);
  await socket?.sendPresenceUpdate('composing', jid);
  delay(1000);
  let send = socket?.sendMessage(jid, messageTypeFile);
  let messageSent = await send;
  return res.status(200).send(JSON.stringify({ accountStatus: statusAccount, chatID: jid, messageID: messageSent?.key.id, message: typeMessage }));
});

export default router;

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

router.post("/sendfile", middlewares, async (req, res) => {
  const instance = Instance;
  const socket = instance.instances[port].instance.socket;
  let statusAccount, typeMessage, messageTypeFile, fileName, typeFile, mimeFile;
  let data = req.body;
  let jid = returnJid();
  typeFile = mime.lookup(data.body);
  if (typeFile == 'image/jpg') {
    typeFile = 'image/jpeg';
  }
  if (typeFile == "audio/ogg" || mimeFile == "audio/oga") {
    typeFile = "audio/ogg; codecs=opus";
  }
  mimeFile = mime.extension(typeFile);
  if (mimeFile == "oga") {
    mimeFile = "ogg";
  }
  if (data.filename) {
    fileName = data.filename;
  } else {
    fileName = Math.floor(Math.random() * 1000 * 1111111111111111) + "." + mimeFile;
  }
  if (typeFile == 'image/gif') {
    return res.end(JSON.stringify({ accountStatus: false, message: "Use endpoint /sendgif" }));
  } else if (typeFile == 'image/jpeg' || typeFile == "image/jpg" || typeFile == 'image/png' || typeFile == "image/webp") {
    statusAccount = true;
    messageTypeFile = {
      image: { url: data.body },
      contextInfo: { mentionedJid: data.mentioned ? data.mentioned : undefined },
      viewOnce: data.viewOnce ? data.viewOnce : undefined,
      mimetype: typeFile,
      ptt: undefined,
      caption: data.caption ? data.caption : "",
      fileName: data.filename ? data.filename : fileName
    };
    typeMessage = "Image sent successfully!";
  } else if (typeFile == 'video/mp4' || typeFile == 'application/ogg' || typeFile == 'video/mpeg') {
    statusAccount = true;
    messageTypeFile = {
      video: { url: data.body },
      contextInfo: { mentionedJid: data.mentioned ? data.mentioned : undefined },
      viewOnce: data.viewOnce ? data.viewOnce : undefined,
      gifPlayback: false,
      ptt: undefined,
      mimetype: typeFile,
      caption: data.caption ? data.caption : "",
      fileName: data.filename ? data.filename : fileName
    };
    typeMessage = "Video sent successfully!";
  } else if (typeFile == "application/pdf" || typeFile == "text/plain" || typeFile == "text/html" || typeFile == "text/csv") {
    statusAccount = true;
    messageTypeFile = {
      document: { url: data.body },
      contextInfo: { mentionedJid: data.mentioned ? data.mentioned : undefined },
      viewOnce: data.viewOnce ? data.viewOnce : undefined,
      mimetype: typeFile,
      ptt: undefined,
      caption: data.caption ? data.caption : "",
      fileName: data.filename ? data.filename : fileName
    };
    typeMessage = "Document sent successfully!";
  } else if (typeFile == "application/msword" || typeFile == "application/vnd.openxmlformats-officedocument.wordprocessingml.document" || typeFile == "application/excel" || typeFile == "application/octet-stream" || typeFile == "application/vnd.ms-excel" || typeFile == "application/msexcel" || typeFile == "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet") {
    statusAccount = true;
    messageTypeFile = {
      document: { url: data.body },
      contextInfo: { mentionedJid: data.mentioned ? data.mentioned : undefined },
      viewOnce: data.viewOnce ? data.viewOnce : undefined,
      mimetype: typeFile,
      ptt: undefined,
      caption: data.caption ? data.caption : "",
      fileName: data.filename ? data.filename : fileName
    };
    typeMessage = "Document sent successfully!";
  } else if (typeFile == 'audio/ogg' || typeFile == 'audio/mp4' || typeFile == 'audio/mpeg' || typeFile == 'audio/ogg; codecs=opus') {
    statusAccount = true;
    messageTypeFile = {
      audio: { url: data.body },
      contextInfo: { mentionedJid: data.mentioned ? data.mentioned : undefined },
      viewOnce: data.viewOnce ? data.viewOnce : undefined,
      mimetype: typeFile,
      ptt: false,
      caption: data.caption ? data.caption : "",
      fileName: data.filename ? data.filename : fileName
    };
    typeMessage = "Audio sent successfully!";
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

router.post("/sendfilebase64", middlewares, async (req, res) => {
  const instance = Instance;
  const socket = instance.instances[port].instance.socket;
  let statusAccount, typeMessage, messageTypeFile, fileName, typeFile, mimeFile, buffer;
  let data = req.body;
  let jid = returnJid();
  let base64Data = data.body.split("base64,")[1];
  buffer = Buffer.from(base64Data, 'base64');
  typeFile = data.body.replace(/.*data:(.*);base64,.*/, '$1');
  if (typeFile == 'image/jpg') {
    typeFile = 'image/jpeg';
  }
  if (typeFile == "audio/ogg" || mimeFile == "audio/oga") {
    typeFile = "audio/ogg; codecs=opus";
  }
  mimeFile = mime.extension(typeFile);
  if (mimeFile == "oga") {
    mimeFile = "ogg";
  }
  if (data.filename) {
    fileName = data.filename;
  } else {
    fileName = Math.floor(Math.random() * 1000 * 1111111111111111) + "." + mimeFile;
  }
  if (typeFile == 'image/gif') {
    return res.end(JSON.stringify({ accountStatus: false, message: "Use endpoint /sendgif" }));
  } else if (typeFile == 'image/jpeg' || typeFile == "image/jpg" || typeFile == 'image/png' || typeFile == "image/webp") {
    statusAccount = true;
    messageTypeFile = {
      image: buffer,
      contextInfo: { mentionedJid: data.mentioned ? data.mentioned : undefined },
      viewOnce: data.viewOnce ? data.viewOnce : undefined,
      mimetype: typeFile,
      ptt: undefined,
      caption: data.caption ? data.caption : "",
      fileName: data.filename ? data.filename : fileName
    };
    typeMessage = "Image sent successfully!";
  } else if (typeFile == 'video/mp4' || typeFile == 'application/ogg' || typeFile == 'video/mpeg') {
    statusAccount = true;
    messageTypeFile = {
      video: buffer,
      contextInfo: { mentionedJid: data.mentioned ? data.mentioned : undefined },
      viewOnce: data.viewOnce ? data.viewOnce : undefined,
      mimetype: typeFile,
      ptt: undefined,
      caption: data.caption ? data.caption : "",
      fileName: data.filename ? data.filename : fileName
    };
    typeMessage = "Video sent successfully!";
  } else if (typeFile == "application/pdf" || typeFile == "text/plain" || typeFile == "text/html" || typeFile == "text/csv") {
    statusAccount = true;
    messageTypeFile = {
      document: buffer,
      contextInfo: { mentionedJid: data.mentioned ? data.mentioned : undefined },
      viewOnce: data.viewOnce ? data.viewOnce : undefined,
      mimetype: typeFile,
      ptt: undefined,
      caption: data.caption ? data.caption : "",
      fileName: data.filename ? data.filename : fileName
    };
    typeMessage = "Document sent successfully!";
  } else if (typeFile == "application/msword" || typeFile == "application/vnd.openxmlformats-officedocument.wordprocessingml.document" || typeFile == "application/excel" || typeFile == "application/octet-stream" || typeFile == "application/vnd.ms-excel" || typeFile == "application/msexcel" || typeFile == "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet") {
    statusAccount = true;
    messageTypeFile = {
      document: buffer,
      contextInfo: { mentionedJid: data.mentioned ? data.mentioned : undefined },
      viewOnce: data.viewOnce ? data.viewOnce : undefined,
      mimetype: typeFile,
      ptt: undefined,
      caption: data.caption ? data.caption : "",
      fileName: data.filename ? data.filename : fileName
    };
    typeMessage = "Document sent successfully!";
  } else if (typeFile == 'audio/ogg' || typeFile == 'audio/mp4' || typeFile == 'audio/mpeg' || typeFile == 'audio/ogg; codecs=opus') {
    statusAccount = true;
    messageTypeFile = {
      audio: buffer,
      contextInfo: { mentionedJid: data.mentioned ? data.mentioned : undefined },
      viewOnce: data.viewOnce ? data.viewOnce : undefined,
      mimetype: typeFile,
      ptt: false,
      caption: data.caption ? data.caption : "",
      fileName: data.filename ? data.filename : fileName
    };
    typeMessage = "Audio sent successfully!";
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

const port = process.argv[2];
const urlWebhook = process.argv[4];

require('express-async-errors');
import methodOverride from "method-override";
import express from "express";
import helmet from "helmet";
import compress from "compression";
import cors from "cors";
import https from "https";
import path from "path";

const rootDir = path.join(__dirname, "..");
import fs from "fs";
import * as dotenv from "dotenv";
dotenv.config();

// const separateReqPool = { maxSockets: 20 };
// import request from 'requestretry';

import { delay } from '@adiwajshing/baileys';
import { WhatsAppInstance } from './api';

const instances: Record<string, WhatsAppInstance> = {};

const Iniciar = () => {
  const instance = new WhatsAppInstance(port);
  instance.connect();
  instances[port] = instance;
}

Iniciar();

export const Instance = {
  instances
}

import { handleError } from './middlewares/handleError';

import sendPool from './routes/sendPool';

import status from './routes/status';
import takeover from './routes/takeover';
import logout from './routes/logout';
import qrCode from './routes/qrCode';
import checkNumber from './routes/checkNumber';
import forwardMessage from './routes/forwardMessage';
import quoteMessage from './routes/quoteMessage';
import deleteMessage from './routes/deleteMessage';
import getMessages from './routes/getMessages';
import getChats from './routes/getChats';
import getContacts from './routes/getContacts';
import getPictureUrl from './routes/getPictureUrl';
import downloadMediaMessage from './routes/downloadMediaMessage';
import getGroups from './routes/getGroups';
import getInfoGroup from './routes/getInfoGroup';
import getGroupInviteCode from './routes/getGroupInviteCode';
import acceptInviteCodeGroup from './routes/acceptInviteCodeGroup';
import revokeGroupInviteCode from './routes/revokeGroupInviteCode';
import createGroup from './routes/createGroup';
import leaveGroup from './routes/leaveGroup';
import setPicture from './routes/setPicture';
import setName from './routes/setName';
import sendMessage from './routes/sendMessage';
import sendSticker from './routes/sendSticker';
import sendContact from './routes/sendContact';
import sendLocation from './routes/sendLocation';
import sendFile from './routes/sendFile';
import sendGif from './routes/sendGif';
import sendPtt from './routes/sendPtt';
import sendButton from './routes/sendButton';
import sendButtonTemplate from './routes/sendButtonTemplate';
import sendList from './routes/sendList';
import sendProduct from './routes/sendProduct';
import sendCatalog from './routes/sendCatalog';
import sendOrder from './routes/sendOrder';
import sendLinkPreview from './routes/sendLinkPreview';
import setGroupSubject from './routes/setGroupSubject';
import setGroupDescription from './routes/setGroupDescription';
import setGroupSettings from './routes/setGroupSettings';
import setGroupParticipantSetting from './routes/setGroupParticipantSetting';
import setWebhook from './routes/setWebhook';

// globalClient.ev.on('messages.upsert', async (mNew) => {
//   try {

//     if (!mNew.messages) return;

//     mNew = mNew.messages[0];

//     if (mNew.key.remoteJid == 'status@broadcast') return;

//     if (!mNew.message) return;

//     const messageType = Object.keys(mNew.message)[0];
//     if (["protocolMessage", "senderKeyDistributionMessage"].includes(messageType)) return;

//     var objReceived = { options: [], message: [] };
//     objReceived.options.push({ port: port });
//     objReceived.message.push(mNew);

//     let stream, bodyBase64, mimeFile;
//     if (messageType === 'imageMessage' || messageType === 'videoMessage' || messageType === 'stickerMessage' || messageType === 'documentMessage' || messageType === 'audioMessage') {
//       if (messageType === 'imageMessage') {
//         stream = await downloadContentFromMessage(mNew.message.imageMessage, 'image');
//         mimeFile = mNew.message.imageMessage.mimetype;
//       } else if (messageType === 'videoMessage') {
//         stream = await downloadContentFromMessage(mNew.message.videoMessage, 'video');
//         mimeFile = mNew.message.videoMessage.mimetype;
//       } else if (messageType === 'stickerMessage') {
//         stream = await downloadContentFromMessage(mNew.message.stickerMessage, 'image');
//         mimeFile = mNew.message.stickerMessage.mimetype;
//       } else if (messageType === 'audioMessage') {
//         stream = await downloadContentFromMessage(mNew.message.audioMessage, 'audio');
//         mimeFile = mNew.message.audioMessage.mimetype;
//       } else if (messageType === 'documentMessage') {
//         stream = await downloadContentFromMessage(mNew.message.documentMessage, 'document');
//         mimeFile = mNew.message.documentMessage.mimetype;
//       }
//       let buffer = Buffer.from([]);
//       for await (const chunk of stream) {
//         buffer = Buffer.concat([buffer, chunk]);
//       }
//       bodyBase64 = buffer.toString("base64");
//       // `objReceived.message[0].message.${messageType}.body` = `data:${mimeFile};base64,${bodyBase64}`;
//       let body = `data:${mimeFile};base64,${bodyBase64}`;
//       let objReceiveds = Object.assign(objReceived, { body });
//       await delay(1000);
//       await request({ url: urlWebhook, pool: separateReqPool, method: "POST", json: objReceiveds, maxAttempts: 5, retryDelay: 500, retryStrategy: request.RetryStrategies.HTTPOrNetworkError });
//     } else {
//       await delay(1000);
//       await request({ url: urlWebhook, pool: separateReqPool, method: "POST", json: objReceived, maxAttempts: 5, retryDelay: 500, retryStrategy: request.RetryStrategies.HTTPOrNetworkError });
//     }
//     if (mNew.key.fromMe == false) {
//       console.log("Recebeu mensagem e encaminhou para o Webhook!");
//     } else if (mNew.key.fromMe == true) {
//       console.log("Enviou mensagem e encaminhou para o Webhook!");
//     }
//     // await delay(500);
//     // if (mNew.message.protocolMessage && mNew.key.fromMe == false);
//     // request({ url: urlWebhook, pool: separateReqPool, method: "POST", json: objReceived, maxAttempts: 5, retryDelay: 500, retryStrategy: request.RetryStrategies.HTTPOrNetworkError });
//   } catch (e) {
//     console.log(e)
//   }
// });

// globalClient.ev.on('messages.update', async (mNew) => {
//   try {
//     if (!mNew) return;
//     // mNew = mNew[0];
//     for (var key in mNew) {
//       if (mNew[key].key.remoteJid == 'status@broadcast') return;
//       var objMessage = { options: [], message: [] };
//       objMessage.options.push({ port: port });
//       objMessage.message.push(mNew[key]);
//       await delay(2000);
//       request({ url: urlWebhook, pool: separateReqPool, method: "POST", json: objMessage, maxAttempts: 5, retryDelay: 500, retryStrategy: request.RetryStrategies.HTTPOrNetworkError });
//       console.log('ACK de mensagem atualizado!');
//     }
//   } catch (e) {
//     console.log(e)
//   }
// });

const app = express();
app.use(cors());
app.use(helmet({}));
// app.use(helmet({
//   contentSecurityPolicy: {
//     directives: {
//       defaultSrc: [`'self'`],
//       styleSrc: [`'self'`, `'unsafe-inline'`],
//       imgSrc: [`'self'`, "data:", "validator.swagger.io"],
//       scriptSrc: [`'self'`, `https: 'unsafe-inline'`]
//     }
//   }
// }));

app.set('view engine', 'ejs');
app.use(methodOverride());
app.use(compress());
app.use(express.json({
  limit: "20000kb"
}));
app.use(express.urlencoded({
  extended: true, limit: "20000kb"
}));

app.use(async (req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST");
  res.setHeader("Content-Type", "application/json");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  res.setHeader("Access-Control-Allow-Credentials", "true");
  return next();
});

app.use(async (req, res, next) => {
  console.log(`Método: ${req.method} || URL: ${req.originalUrl} || Cliente: ${req.ip} `);
  return next();
});

app.use(sendPool);

app.use(status);
app.use(takeover);
app.use(logout);
app.use(qrCode);
app.use(checkNumber);
app.use(forwardMessage);
app.use(quoteMessage);
app.use(deleteMessage);
app.use(getMessages);
app.use(getChats);
app.use(getContacts);
app.use(getPictureUrl);
app.use(downloadMediaMessage);
app.use(getGroups);
app.use(getInfoGroup);
app.use(getGroupInviteCode);
app.use(revokeGroupInviteCode);
app.use(acceptInviteCodeGroup);
app.use(createGroup);
app.use(leaveGroup);
app.use(setPicture);
app.use(setName);
app.use(setGroupSubject);
app.use(setGroupDescription);
app.use(setGroupSettings);
app.use(setGroupParticipantSetting);
app.use(sendMessage);
app.use(sendSticker);
app.use(sendContact);
app.use(sendLocation);
app.use(sendFile);
app.use(sendGif);
app.use(sendPtt);
app.use(sendButton);
app.use(sendButtonTemplate);
app.use(sendList);
app.use(sendProduct);
app.use(sendCatalog);
app.use(sendOrder);
app.use(sendLinkPreview);
app.use(setWebhook);

app.use(handleError);

if (Number(process.env.HTTPS) == 1) {
  var serverOptions = {
    key: fs.readFileSync(`${rootDir}/../ssl/privkey.pem`),
    cert: fs.readFileSync(`${rootDir}/../ssl/fullchain.pem`)
  };
  https.createServer(serverOptions, app).listen(port, () => {
    console.log('Servidor HTTPS rodando em: ' + process.env.HOST_HTTPS + ':' + port + '/');
  });
} else if (Number(process.env.HTTPS) == 0) {
  app.listen(port, () => {
    console.log('Servidor HTTP rodando em: ' + process.env.HOST_HTTP + ':' + port + '/');
  });
}

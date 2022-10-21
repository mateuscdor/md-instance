const port = process.argv[2];
const urlWebhook = process.argv[4];

import {
  delay,
  proto,
  generateWAMessageFromContent,
  prepareWAMessageMedia,
  MediaGenerationOptions,
  MessageRelayOptions,
  MessageGenerationOptionsFromContent
} from '@adiwajshing/baileys';

import { Instance } from '../app';

// const getThumbnailURL = require('yt-thumbnail-viewer');
import getThumbnailURL from 'youtube-thumbnail';
import express from "express";
const router = express.Router();

// middlewares
import { connection } from '../middlewares/connection';
import { authentication } from '../middlewares/auth';
import { checkJsonLink } from '../middlewares/checkJson';
import { returnJid, checkJid } from '../middlewares/checkChat';

const middlewares = [connection, authentication, checkJsonLink, checkJid];

router.post("/sendlinkpreview", middlewares, async (req, res) => {
  const instance = Instance;
  const socket = instance.instances[port].instance.socket;
  let data = req.body;
  let jid = returnJid();
  let ytThumbnail = await getThumbnailURL(data.text);
  let thumb = await prepareWAMessageMedia({ image: { url: ytThumbnail.default.url } }, { upload: socket?.waUploadToServer } as MediaGenerationOptions);
  let extendedTextMessage =
  {
    text: data.text,
    matchedText: data.matchedText,
    canonicalUrl: data.canonicalUrl,
    description: data.description,
    title: data.title,
    previewType: 'VIDEO',
    jpegThumbnail: thumb.imageMessage?.jpegThumbnail,
    contextInfo:
    {
      //"forwardingScore": 2,
      //"isForwarded": true
    }
  }
  await socket?.presenceSubscribe(jid);
  delay(500);
  await socket?.sendPresenceUpdate('composing', jid);
  delay(1000);
  const templateLink = generateWAMessageFromContent(jid, proto.Message.fromObject({ "extendedTextMessage": extendedTextMessage }), {} as MessageGenerationOptionsFromContent);
  delay(500);
  let send = await socket?.relayMessage(jid, templateLink.message as proto.IMessage, { messageId: templateLink.key.id } as MessageRelayOptions);
  let messageSent = await send;
  let objReceived: any = { options: [], messages: [] };
  objReceived.options.push({ port: port });
  objReceived.messages.push(templateLink);
  console.log("Enviou mensagem e encaminhou para o Webhook!");
  await delay(500);
  // request({ url: urlWebhook, pool: separateReqPool, method: "POST", json: objReceived, maxAttempts: 5, retryDelay: 500, retryStrategy: request.RetryStrategies.HTTPOrNetworkError });
  // return res.send(JSON.stringify({ accountStatus: true, chatID: jid, messageID: messageSent, message: "Link sent successfully!" }));
});

export default router;

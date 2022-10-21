const port = process.argv[2];
const urlWebhook = process.argv[4];

import {
  delay,
  proto,
  generateWAMessageFromContent,
  prepareWAMessageMedia,
  MessageRelayOptions,
  MessageGenerationOptionsFromContent,
  MediaGenerationOptions
} from '@adiwajshing/baileys';

import { Instance } from '../app';

import express from "express";
const router = express.Router();

// middlewares
import { connection } from '../middlewares/connection';
import { authentication } from '../middlewares/auth';
import { checkJsonCatalog } from '../middlewares/checkJson';
import { returnJid, checkJid } from '../middlewares/checkChat';

const middlewares = [connection, authentication, checkJsonCatalog, checkJid];

router.post("/sendcatalog", middlewares, async (req, res) => {
  const instance = Instance;
  const socket = instance.instances[port].instance.socket;
  let data = req.body;
  let jid = returnJid();
  let thumb;
  if (data.catalogImage && data.catalogImage != '') {
    let convertThumb = await prepareWAMessageMedia({ image: { url: data.catalogImage } }, { upload: socket?.waUploadToServer } as MediaGenerationOptions);
    thumb = convertThumb?.imageMessage?.jpegThumbnail;
  } else {
    thumb = undefined;
  }
  let extendedTextMessage =
  {
    text: data.text,
    matchedText: data.matchedText,
    title: data.title,
    previewType: 'NONE',
    jpegThumbnail: thumb,
    font: data.font,
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
  const templateCatalog = generateWAMessageFromContent(jid, proto?.Message.fromObject({ "extendedTextMessage": extendedTextMessage }), {} as MessageGenerationOptionsFromContent);
  delay(500);
  let send = await socket?.relayMessage(jid, templateCatalog?.message as proto.IMessage, { messageId: templateCatalog.key.id } as MessageRelayOptions);
  let messageSent = send;
  let objReceived: any = { options: [], messages: [] };
  objReceived.options.push({ port: port });
  objReceived.messages.push(templateCatalog);
  console.log("Enviou mensagem e encaminhou para o Webhook!");
  await delay(500);
  // request({ url: urlWebhook, pool: separateReqPool, method: "POST", json: objReceived, maxAttempts: 5, retryDelay: 500, retryStrategy: request.RetryStrategies.HTTPOrNetworkError });
  // return res.send(JSON.stringify({ accountStatus: true, chatID: jid, messageID: messageSent, message: "Catalog sent successfully!" }));
});

export default router;

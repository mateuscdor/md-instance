const port = process.argv[2];

import { delay, proto, generateWAMessageFromContent } from '@adiwajshing/baileys';

import { Instance } from '../app';

import express from "express";
const router = express.Router();

// middlewares
import { connection } from '../middlewares/connection';
import { authentication } from '../middlewares/auth';
import { checkJsonButtons } from '../middlewares/checkJson';
import { returnJid, checkJid } from '../middlewares/checkChat';

const middlewares = [connection, authentication, checkJsonButtons, checkJid];

router.post("/sendbuttontemplate", middlewares, async (req, res) => {
  const instance = Instance;
  const socket = instance.instances[port].instance.socket;
  let data = req.body;
  let templateMessage;
  let templateButtons = data.buttons;
  let jid = returnJid();
  if (data.type == "text") {
    templateMessage = {
      caption: undefined,
      text: data.caption ? data.caption : undefined,
      footer: data.footer ? data.footer : undefined,
      templateButtons: templateButtons
    }
  } else if (data.type == 'image' && data.body) {
    templateMessage = {
      caption: data.caption ? data.caption : undefined,
      footer: data.footer ? data.footer : undefined,
      templateButtons: templateButtons,
      image: { url: data.body }
    }
  } else if (data.type == 'document' && data.body) {
    templateMessage = {
      caption: data.caption ? data.caption : undefined,
      footer: data.footer ? data.footer : undefined,
      templateButtons: templateButtons,
      document: { url: data.body }
    }
  } else if (data.type == 'video' && data.body) {
    templateMessage = {
      caption: data.caption ? data.caption : undefined,
      footer: data.footer ? data.footer : undefined,
      templateButtons: templateButtons,
      video: { url: data.body },
      gifPlayback: true
    }
  } else if (data.type == 'location') {
    templateMessage = {
      caption: data.caption ? data.caption : undefined,
      footer: data.footer ? data.footer : undefined,
      templateButtons: templateButtons,
      location: {
        degreesLatitude: data.latitude,
        degreesLongitude: data.longitude,
        address: data.address,
        name: data.name
      }
    }
  } else {
    return res.send(JSON.stringify({ accountStatus: false, message: 'For buttons like: image, video, document, location, it is necessary to inform the "body:" in the JSON!' }));
  }
  await socket?.presenceSubscribe(jid);
  delay(500);
  await socket?.sendPresenceUpdate('composing', jid);
  delay(1000);
  let send = await socket?.sendMessage(jid, templateMessage);
  let messageSent = await send;
  return res.send(JSON.stringify({ accountStatus: true, chatID: jid, messageID: messageSent?.key.id, message: "Message template button sent successfully!" }));
});

export default router;

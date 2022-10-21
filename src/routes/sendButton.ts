const port = process.argv[2];

import { proto, delay } from '@adiwajshing/baileys';

import { Instance } from '../app';

import express from "express";
const router = express.Router();

// middlewares
import { connection } from '../middlewares/connection';
import { authentication } from '../middlewares/auth';
import { checkJsonButtons } from '../middlewares/checkJson';
import { returnJid, checkJid } from '../middlewares/checkChat';

const middlewares = [connection, authentication, checkJsonButtons, checkJid];

router.post("/sendbutton", middlewares, async (req, res) => {
  const instance = Instance;
  const socket = instance.instances[port].instance.socket;

  let data = req.body;
  let buttonMessage;
  let jid = returnJid();
  const addButtons: proto.Message.ButtonsMessage.IButton[] = [];

  for (var key in data.buttons) {
    addButtons.push({
      buttonId: `id${key}`,
      buttonText: {
        displayText: data.buttons[key]
      },
      type: 1
    });
  };

  if (data.type == "text") {
    buttonMessage = {
      text: data.displayText ? data.displayText : undefined,
      footer: data.caption ? data.caption : undefined,
      buttons: addButtons,
      headerType: 1
    }
  } else if (data.type == "document" && data.body) {
    buttonMessage = {
      document: { url: data.body },
      caption: data.displayText ? data.displayText : undefined,
      footer: data.caption ? data.caption : undefined,
      buttons: addButtons,
      headerType: 3,
    }
  } else if (data.type == "image" && data.body) {
    buttonMessage = {
      image: { url: data.body },
      caption: data.displayText ? data.displayText : undefined,
      footer: data.caption ? data.caption : undefined,
      buttons: addButtons,
      headerType: 4,
    }
  } else if (data.type == "video" && data.body) {
    buttonMessage = {
      video: { url: data.body },
      gifPlayback: true,
      caption: data.displayText ? data.displayText : undefined,
      footer: data.caption ? data.caption : undefined,
      buttons: addButtons,
      headerType: 5,
    }
  } else {
    return res.send(JSON.stringify({ accountStatus: false, message: 'For buttons like: image, video, document, it is necessary to inform the "body:" in the JSON!' }));
  }
  await socket?.presenceSubscribe(jid);
  delay(500);
  await socket?.sendPresenceUpdate('composing', jid);
  delay(1000);
  let send = await socket?.sendMessage(jid, buttonMessage);
  let messageSent = await send;
  return res.send(JSON.stringify({ accountStatus: true, chatID: jid, messageID: messageSent?.key.id, message: "Message button sent successfully!" }));
});

export default router;

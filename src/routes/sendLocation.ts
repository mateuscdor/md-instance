const port = process.argv[2];

import { delay } from '@adiwajshing/baileys';

import { Instance } from '../app';

import mime from 'mime-types';
import express from "express";
const router = express.Router();

// middlewares
import { connection } from '../middlewares/connection';
import { authentication } from '../middlewares/auth';
import { checkJsonLocation } from '../middlewares/checkJson';
import { returnJid, checkJid } from '../middlewares/checkChat';

const middlewares = [connection, authentication, checkJsonLocation, checkJid];

router.post("/sendlocation", middlewares, async (req, res) => {
  const instance = Instance;
  const socket = instance.instances[port].instance.socket;
  const data = req.body;
  const jid = returnJid();
  await socket?.presenceSubscribe(jid);
  delay(500);
  await socket?.sendPresenceUpdate('composing', jid);
  delay(1000);
  let send = socket?.sendMessage(jid, {
    location: { degreesLatitude: data.latitude, degreesLongitude: data.longitude, address: data.address ? data.address : undefined, name: data.name ? data.name : undefined }
  });
  let messageSent = await send;
  return res.status(200).send(JSON.stringify({ accountStatus: true, chatID: jid, messageID: messageSent?.key.id, message: "Location sent succesfully!" }));
});

export default router;

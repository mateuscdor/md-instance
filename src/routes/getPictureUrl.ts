const port = process.argv[2];

import { delay } from '@adiwajshing/baileys';

import { Instance } from '../app';

import express from "express";
const router = express.Router();

// middlewares
import { connection } from '../middlewares/connection';
import { authentication } from '../middlewares/auth';
import { checkJsonPicture } from '../middlewares/checkJson';
import { returnJid, checkJid } from '../middlewares/checkChat';

const middlewares = [connection, authentication, checkJsonPicture, checkJid];

router.post("/getpictureurl", middlewares, async (req, res) => {
  const instance = Instance;
  const socket = instance.instances[port].instance.socket;
  const data = req.body;
  const jid = returnJid();
  if (data.resolution == "low") {
    const imageLow = await socket?.profilePictureUrl(jid);
    return res.status(200).end(JSON.stringify({ accountStatus: true, phone: jid, resolution: data.resolution, url: imageLow }));
  } else if (data.resolution == "high") {
    const imageHigh = await socket?.profilePictureUrl(jid, 'image');
    return res.status(200).end(JSON.stringify({ accountStatus: true, phone: jid, resolution: data.resolution, url: imageHigh }));
  } else {
    return res.status(400).end(JSON.stringify({ accountStatus: false, message: `Resolution '${data.resolution}' incorrect!` }));
  }
});

export default router;

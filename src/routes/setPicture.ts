const port = process.argv[2];

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

router.post("/setpicture", middlewares, async (req, res) => {
  const instance = Instance;
  const socket = instance.instances[port].instance.socket;
  let typeFile;
  let data = req.body;
  let jid = returnJid();
  typeFile = mime.lookup(data.body);
  if (typeFile == "image/gif" || typeFile == "image/webp") {
    return res.status(200).end(JSON.stringify({ accountStatus: false, message: "Supported formats: 'image/jpeg and image/png'" }));
  } else if (typeFile == 'image/jpeg' || typeFile == "image/jpg" || typeFile == 'image/png') {
    await socket?.updateProfilePicture(jid, { url: data.body });
    return res.status(200).end(JSON.stringify({ accountStatus: true, message: "Image successfully set!" }));
  } else {
    return res.status(200).end(JSON.stringify({ accountStatus: false, message: `Mime format '${typeFile}' not supported!` }));
  }
});

router.post("/setpicturebase64", middlewares, async (req, res) => {
  const instance = Instance;
  const socket = instance.instances[port].instance.socket;
  let typeFile, buffer;
  let data = req.body;
  let jid = returnJid();
  typeFile = data.body.replace(/.*data:(.*);base64,.*/, '$1');
  let base64Data = data.body.split("base64,")[1];
  buffer = Buffer.from(base64Data, 'base64');
  if (typeFile == "image/gif" || typeFile == "image/webp") {
    return res.status(200).end(JSON.stringify({ accountStatus: false, message: "Supported formats: 'image/jpeg and image/png'" }));
  } else if (typeFile == 'image/jpeg' || typeFile == "image/jpg" || typeFile == 'image/png') {
    await socket?.updateProfilePicture(jid, buffer);
    return res.status(200).end(JSON.stringify({ accountStatus: true, message: "Image successfully set!" }));
  } else {
    return res.status(200).end(JSON.stringify({ accountStatus: false, message: `Mime format '${typeFile}' not supported!` }));
  }
});

export default router;

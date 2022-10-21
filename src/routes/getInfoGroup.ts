const port = process.argv[2];

import { delay } from '@adiwajshing/baileys';

import { Instance } from '../app';

import express from "express";
const router = express.Router();

// middlewares
import { connection } from '../middlewares/connection';
import { authentication } from '../middlewares/auth';
import { checkJsonJidGroup } from '../middlewares/checkJson';
import { returnJid, checkJid } from '../middlewares/checkChat';

const middlewares = [connection, authentication, checkJsonJidGroup, checkJid];

router.post("/getinfogroup", middlewares, async (req, res) => {
  const instance = Instance;
  const socket = instance.instances[port].instance.socket;
  const jid = returnJid();
  const getInfoGroups: any = await socket?.groupMetadata(jid);
  let objGroup: any = { options: [], group: [] };
  objGroup.options.push({ port: port });
  if (getInfoGroups.desc && getInfoGroups.desc != undefined) {
    var buffer = Buffer.from(getInfoGroups.desc);
    getInfoGroups.desc = buffer.toString();
  } else {
    getInfoGroups.desc = null;
    getInfoGroups.descId = null;
  }
  objGroup.group.push(getInfoGroups);
  return res.status(200).send(JSON.stringify(objGroup));
});

export default router;

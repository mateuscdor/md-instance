const port = process.argv[2];

import { delay } from '@adiwajshing/baileys';

import { Instance } from '../app';

import express from "express";
const router = express.Router();

// middlewares
import { connection } from '../middlewares/connection';
import { authentication } from '../middlewares/auth';
import { checkJsonJid } from '../middlewares/checkJson';
import { returnJid, checkJid } from '../middlewares/checkChat';

const middlewares = [connection, authentication, checkJsonJid, checkJid];

router.post("/leavegroup", middlewares, async (req, res) => {
  const instance = Instance;
  const socket = instance.instances[port].instance.socket;
  // const data = await req.body;
  const jid = returnJid();
  await socket?.groupLeave(jid);
  return res.status(200).send(JSON.stringify({ accountStatus: true, id: jid, message: "Group exit successfully!", }));
});

export default router;

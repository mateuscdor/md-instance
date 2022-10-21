const port = process.argv[2];

import { Instance } from '../app';

import express from "express";
const router = express.Router();

// middlewares
import { connection } from '../middlewares/connection';
import { authentication } from '../middlewares/auth';
import { checkJsonGroupSubject } from '../middlewares/checkJson';
import { returnJid, checkJid } from '../middlewares/checkChat';

const middlewares = [connection, authentication, checkJsonGroupSubject, checkJid];

router.post("/setgroupsubject", middlewares, async (req, res) => {
  const instance = Instance;
  const socket = instance.instances[port].instance.socket;
  const data = req.body;
  const jid = returnJid();;
  await socket?.groupUpdateSubject(jid, data.subject);
  return res.status(200).end(JSON.stringify({ accountStatus: true, message: "Subject of the group successfully set!" }));
});

export default router;

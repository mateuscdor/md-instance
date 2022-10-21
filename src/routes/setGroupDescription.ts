const port = process.argv[2];

import { Instance } from '../app';

import express from "express";
const router = express.Router();

// middlewares
import { connection } from '../middlewares/connection';
import { authentication } from '../middlewares/auth';
import { checkJsonGroupDescription } from '../middlewares/checkJson';
import { returnJid, checkJid } from '../middlewares/checkChat';

const middlewares = [connection, authentication, checkJsonGroupDescription, checkJid];

router.post("/setgroupdescription", middlewares, async (req, res) => {
  const instance = Instance;
  const socket = instance.instances[port].instance.socket;
  const data = req.body;
  const jid = returnJid();
  await socket?.groupUpdateDescription(jid, data.description);
  return res.status(200).end(JSON.stringify({ accountStatus: true, message: "Description of the group successfully set!" }));
});

export default router;

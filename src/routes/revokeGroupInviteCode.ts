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

const middlewares = [connection, authentication, checkJid, checkJsonJidGroup];

router.post("/revokegroupinvitecode", middlewares, async (req, res) => {
  const instance = Instance;
  const socket = instance.instances[port].instance.socket;
  let jid = returnJid();
  const code = await socket?.groupRevokeInvite(jid);
  return res.status(200).send(JSON.stringify({ accountStatus: true, group: jid, newInviteCode: code }));
});

export default router;

const port = process.argv[2];

import { delay } from '@adiwajshing/baileys';

import { Instance } from '../app';

import express from "express";
const router = express.Router();

// middlewares
import { connection } from '../middlewares/connection';
import { authentication } from '../middlewares/auth';
import { checkJsonCodeGroup } from '../middlewares/checkJson';

const middlewares = [connection, authentication, checkJsonCodeGroup];

router.post("/acceptinvitecodegroup", middlewares, async (req, res) => {
  const instance = Instance;
  const socket = instance.instances[port].instance.socket;
  const data = await req.body;
  const response = await socket?.groupAcceptInvite(data.code);
  return res.status(200).send(JSON.stringify({ accountStatus: true, group: response, inviteCode: data.code, message: "Group code accepted!" }));
});

export default router;

const port = process.argv[2];

import { delay } from '@adiwajshing/baileys';

import { Instance } from '../app';

import express from "express";
const router = express.Router();

// middlewares
import { connection } from '../middlewares/connection';
import { authentication } from '../middlewares/auth';
import { checkJsonCreateGroup } from '../middlewares/checkJson';

const middlewares = [connection, authentication, checkJsonCreateGroup];

router.post("/creategroup", middlewares, async (req, res) => {
  const instance = Instance;
  const socket = instance.instances[port].instance.socket;

  const data = await req.body;
  const participants = data.participants;
  const objParticipants = [];
  let group = await socket?.groupCreate(data.subject, objParticipants.map(participants));
  return res.status(200).send(JSON.stringify({ accountStatus: true, id: group?.id, name: group?.subject, message: "Group created successfully and participants add!", }));
});

export default router;

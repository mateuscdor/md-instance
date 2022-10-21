const port = process.argv[2];

import { Instance } from '../app';

import express from "express";
const router = express.Router();

// middlewares
import { connection } from '../middlewares/connection';
import { authentication } from '../middlewares/auth';
import { checkJsonGroupParticipantSetting } from '../middlewares/checkJson';
import { returnJid, checkJid } from '../middlewares/checkChat';

const middlewares = [connection, authentication, checkJsonGroupParticipantSetting, checkJid];

router.post("/setgroupparticipantsetting", middlewares, async (req, res) => {
  const instance = Instance;
  const socket = instance.instances[port].instance.socket;
  const data = req.body;
  const jid = returnJid();
  const setting = data.setting;
  let messageInfo;
  const addParticipant = [];
  addParticipant.map(data.participant);
  switch (setting) {
    case "add":
      messageInfo = 'Participant added to the group!';
      break;
    case "remove":
      messageInfo = 'Participant removed to the group!';
      break;
    case "promote":
      messageInfo = 'Participant promoted as group admin!';
      break;
    case "demote":
      messageInfo = 'Participant demoted as group admin!';
      break;
  }
  await socket?.groupParticipantsUpdate(jid, addParticipant, setting);
  return res.status(200).send(JSON.stringify({ accountStatus: true, participant: data.participant, setting: setting, message: messageInfo }));
});

export default router;

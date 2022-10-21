const port = process.argv[2];

import { Instance } from '../app';

import express from "express";
const router = express.Router();

// middlewares
import { connection } from '../middlewares/connection';
import { authentication } from '../middlewares/auth';
import { checkJsonGroupSettings } from '../middlewares/checkJson';
import { returnJid, checkJid } from '../middlewares/checkChat';

const middlewares = [connection, authentication, checkJsonGroupSettings, checkJid];

router.post("/setgroupsettings", middlewares, async (req, res) => {
  const instance = Instance;
  const socket = instance.instances[port].instance.socket;
  const data = req.body;
  let messageInfo;
  const jid = returnJid();
  let setting = data.setting;
  switch (setting) {
    case "announcement":
      messageInfo = 'Only allow admins to send messages to this group!';
      break;
    case "not_announcement":
      messageInfo = 'Allow everyone to send messages to this group!';
      break;
    case "locked":
      messageInfo = 'Only allow admins to modify the group settings!';
      break;
    case "unlocked":
      messageInfo = 'Allow everyone to modify the group settings!';
      break;
  }
  await socket?.groupSettingUpdate(jid, data.setting);
  res.status(200).send(JSON.stringify({ accountStatus: true, setting: data.setting, message: messageInfo }));
});

export default router;

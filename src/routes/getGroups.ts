const port = process.argv[2];

import express from "express";
const router = express.Router();

import { delay } from '@adiwajshing/baileys';

import { Instance } from '../app';

// middlewares
import { connection } from '../middlewares/connection';
import { authentication } from '../middlewares/auth';

const middlewares = [connection, authentication];

router.get("/getgroups", middlewares, async (req, res) => {
  const instance = Instance;
  const socket = instance.instances[port].instance.socket;
  const getGroups: any = await socket?.groupFetchAllParticipating();
  await delay(1000);
  let groups: any = Object.entries(getGroups).slice(0).map(entry => entry[1]);
  let objGroup: any = { options: [], groups: [] };
  objGroup.options.push({ port: port });
  for (var key in groups) {
    objGroup.groups.push({
      id: groups[key].id,
      subject: groups[key].subject
    });
  }
  return res.status(200).send(JSON.stringify(objGroup));
});

export default router;

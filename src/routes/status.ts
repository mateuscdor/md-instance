const port = process.argv[2];
const urlWebhook = process.argv[4];

import { Instance } from '../app';

import * as dotenv from "dotenv";
dotenv.config();
import express from 'express';
const router = express.Router();

// middlewares
import { authentication } from '../middlewares/auth';
import { connection } from '../middlewares/connection';

const middlewares = [authentication, connection];

router.get("/status", middlewares, async (req, res) => {
  const instance = Instance;
  const socket = instance.instances[port].instance.socket;

  const number = socket?.user?.id;
  const name = socket?.user?.name;
  const verifiedName = socket?.user?.verifiedName;

  return res.status(200).send(JSON.stringify({ accountStatus: true, state: "connected", message: "Cell phone connected and API in operation!", name: name, verifiedName: verifiedName, phone: number, webhook: urlWebhook }));
});

export default router;

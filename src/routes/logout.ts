const port = process.argv[2];
const urlWebhook = process.argv[4];

import { delay } from '@adiwajshing/baileys';

import { Instance } from '../app';

import express from 'express';
const router = express.Router();
import fs from 'fs';

// import shell from "shelljs";
import path from 'path';
const sessions = path.join("sessions", `${port}`);

// middlewares
import { connection } from '../middlewares/connection';
import { authentication } from '../middlewares/auth';

const middlewares = [connection, authentication];

router.get("/logout", middlewares, async (req, res) => {

  const instance = Instance;
  const socket = instance.instances[port].instance?.socket;

  if (fs.existsSync(`${sessions}/creds.json`)) {
    var objLogout = { options: [], info: [] };
    //@ts-ignore
    objLogout.options.push({ port: port });
    //@ts-ignore
    objLogout.info.push({ status: "disconnected", message: "Phone disconnected from API. Use /qrcode to associate!" });
    await delay(500);
    await socket?.logout();
    // await functions?.sendWebhookMessage(objLogout);
    return res.status(200).send(JSON.stringify({ accountStatus: true, message: "Logging out from API..." }));
  } else {
    return res.status(200).send(JSON.stringify({ accountStatus: false, message: "No phone associated in API!" }));
  }
});

export default router;

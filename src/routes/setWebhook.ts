const port = process.argv[2];
const urlWebhook = process.argv[4];

import { delay } from '@adiwajshing/baileys';

import * as dotenv from "dotenv";
dotenv.config();
import express from 'express';
const router = express.Router();

import shell from 'shelljs';
import path from 'path';
import pm2 from 'pm2';

// middlewares
import { authentication } from '../middlewares/auth';
import { checkJsonWebhook } from '../middlewares/checkJson';

const middlewares = [authentication, checkJsonWebhook];

const pathMD = path.join(__dirname, '../../');

router.post('/setwebhook', middlewares, async (req, res) => {

  const data = req.body;
  const configMD = path.join(pathMD, "configs", `${port}.config.js`);
  shell.exec(`sed -i 's;args: ".*",;args: "${String(port)} ${req.query.token} ${data.webhook}",;g' ${configMD}`);
  await delay(500);

  res.status(200).send(JSON.stringify({
    accountStatus: true,
    message: "Webhook set successfully!"
  }))

  return pm2.restart(configMD, async function (err, proc) {
    if (err) {
      throw err;
    }
    shell.exec(`pm2 save -sf`);
    await delay(500);
  });

});

export default router;

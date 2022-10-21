const port = process.argv[2];

import express from 'express';
const router = express.Router();

import pm2 from "pm2";
import shell from "shelljs";

import { delay } from '@adiwajshing/baileys';

// middlewares
import { authentication } from '../middlewares/auth';

const middlewares = [authentication];

router.get("/takeover", middlewares, async (req, res) => {

  res.status(200).send(JSON.stringify({ accountStatus: true, message: "Restarting the API..." }));
  await delay(500);

  return pm2.restart(String(port), function (err, proc) {
    if (err) {
      throw err;
    }
    shell.exec(`pm2 save -sf`);
    return res.status(200).send(JSON.stringify({
      accountStatus: true,
      message: `Instance ${String(port)} successfully restarted!`
    }));
  });

});

export default router;

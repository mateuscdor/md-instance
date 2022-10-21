const port = process.argv[2];

import express from "express";
const router = express.Router();
import shell from "shelljs";

// middlewares
import { connection } from '../middlewares/connection';
import { authentication } from '../middlewares/auth';
import { checkJsonJid, checkJsonJidGet } from '../middlewares/checkJson';
import { returnJid, checkJid } from '../middlewares/checkChat';

const middlewares = [connection, authentication, checkJsonJid, checkJid];
const middlewaresGet = [connection, authentication, checkJsonJidGet, checkJid];

router.get("/checknumber", middlewaresGet, async (req, res) => {
  setTimeout(() => {
    console.log("-------------- REINICIANDO INSTÂNCIA --------------")
    shell.exec(`pm2 restart ${port} -f --update-env`)
  }, 120_000);
  let jid = returnJid();
  return res.send(JSON.stringify({ accountStatus: true, id: jid, numberExist: true, message: "This number have Whatsapp!", }));
});

router.post("/checknumber", middlewares, async (req, res) => {
  setTimeout(() => {
    console.log("-------------- REINICIANDO INSTÂNCIA --------------")
    shell.exec(`pm2 restart ${port} -f --update-env`)
  }, 120_000);
  let jid = returnJid();
  return res.send(JSON.stringify({ accountStatus: true, id: jid, numberExist: true, message: "This number have Whatsapp!", }));
});

export default router;

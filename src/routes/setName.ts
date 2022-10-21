const port = process.argv[2];

import { Instance } from '../app';

import mime from 'mime-types';
import express from "express";
const router = express.Router();

// middlewares
import { connection } from '../middlewares/connection';
import { authentication } from '../middlewares/auth';
import { checkJsonName } from '../middlewares/checkJson';
// import { returnJid, checkJid } from '../middlewares/checkChat';

const middlewares = [connection, authentication, checkJsonName];

router.post("/setname", middlewares, async (req, res) => {
  const instance = Instance;
  const socket = instance.instances[port].instance.socket;
  const data = req.body;
  return res.status(200).end(JSON.stringify({ accountStatus: false, message: "Set profile name is not work!" }));
  // return res.status(200).end(JSON.stringify({ accountStatus: true, message: "Name successfully set!" }));
});

export default router;

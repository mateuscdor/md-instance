const port = process.argv[2];

require('dotenv').config();
import express from "express";
const router = express.Router();

import { delay } from '@adiwajshing/baileys';

import { Instance } from '../app';

import { MessageType } from '@adiwajshing/baileys';

import fs from 'fs';
import path from 'path';
import axios from 'axios';
// const memorys = path.join("memorys", `${port}.store.json`);

// middlewares
import { connection } from '../middlewares/connection';
import { authentication } from '../middlewares/auth';

const middlewares = [connection, authentication];

router.get("/teste", middlewares, async (req, res) => {
  const instance = Instance;
  const socket = instance.instances[port].instance.socket;
  console.log('teste');
});

export default router;

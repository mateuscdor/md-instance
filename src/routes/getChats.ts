const port = process.argv[2];

// import { proto, AnyMessageContent, delay, generateWAMessageFromContent } from '@adiwajshing/baileys';

import { Instance } from '../app';

require('dotenv').config();
import express from 'express';
const router = express.Router();

// import fs from 'fs';
// import path from "path";
// const memorys = path.join("memorys", `${port}.store.json`);
// const contacts = path.join("contacts", `${port}.contacts.json`);

// middlewares
import { authentication } from '../middlewares/auth';
import { connection } from '../middlewares/connection';

const middlewares = [connection, authentication];

router.get("/getchats", middlewares, async (req, res) => {

  const objChats: any = { options: [] };
  objChats.options.push({ port: port });
  const instance = Instance;
  const chats = instance.instances[port].instance.chats;

  if (chats) {
    const newChats = await Object.assign(objChats, { chats });
    return res.status(200).end(JSON.stringify(newChats));
  } else {
    return res.status(200).end(JSON.stringify({ accountStatus: false, message: 'No chats found!' }));
  }

});

export default router;

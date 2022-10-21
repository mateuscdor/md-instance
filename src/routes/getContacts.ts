const port = process.argv[2];

import { proto, AnyMessageContent, delay, generateWAMessageFromContent } from '@adiwajshing/baileys';

import { Instance } from '../app';

require('dotenv').config();
import express from 'express';
const router = express.Router();

import fs from 'fs';
import path from "path";
// const memorys = path.join("memorys", `${port}.store.json`);
// const contacts = path.join("contacts", `${port}.contacts.json`);

// middlewares
import { authentication } from '../middlewares/auth';
import { connection } from '../middlewares/connection';

const middlewares = [connection, authentication];

router.get("/getcontacts", middlewares, async (req, res) => {

  const objContacts: any = { options: [] };
  objContacts.options.push({ port: port });
  const instance = Instance;
  const contacts = instance.instances[port].instance.contacts;

  if (contacts) {
    let newContacts = await Object.assign(objContacts, { contacts });
    return res.status(200).end(JSON.stringify(newContacts));
  } else {
    return res.status(200).end(JSON.stringify({ accountStatus: false, message: 'No contacts found!' }));
  }

});

export default router;

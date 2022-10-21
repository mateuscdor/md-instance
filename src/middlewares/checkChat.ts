const port = process.argv[2];

import { Instance } from '../app';

let jid: string;

export async function checkJid(req, res, next) {
  const instance = Instance;
  const socket = instance.instances[port].instance.socket;

  let data = req.body;
  if (data.jid.endsWith('@s.whatsapp.net') || data.jid.endsWith('@c.us')) {
    let phoneEdit = data.jid.replace("@c.us", "").replace("@s.whatsapp.net", "").replace(/([^\w]+|\s+)/g, "").replace(/\-\-+/g, "");
    let [exist] = await socket?.onWhatsApp(phoneEdit + '@s.whatsapp.net') as {
      exists: boolean;
      jid: string;
    }[];
    // if (exist != undefined && exist.exists === true) {
    if (exist != undefined && exist.exists) {
      jid = exist.jid;
      return next();
    } else if (exist == undefined) {
      return res.status(200).send(JSON.stringify({ accountStatus: false, numberExist: false, message: `This number ${data.jid} does not have WhatsApp!`, }));
    }
  } else if (data.jid.endsWith('@g.us')) {
    jid = data.jid;
    return next();
  } else if (data.jid.endsWith('@broadcast') && data.jid != 'status@broadcast') {
    jid = data.jid;
    // return next();
    return res.status(400).send(JSON.stringify({ accountStatus: "error", message: "Transmission is not working!" }));
  } else if (data.jid == 'status@broadcast') {
    jid = data.jid;
    // return next();
    return res.status(400).send(JSON.stringify({ accountStatus: "error", message: "Status is not working!" }));
  } else {
    return res.status(400).send(JSON.stringify({ accountStatus: "error", message: "Check the jid ID! Example: 123456789@s.whatsapp.net or 987654321@g.us!" }));
  }
}

export function returnJid() {
  var exportJid = jid;
  return exportJid;
}

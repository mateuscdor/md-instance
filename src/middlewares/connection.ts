const port = process.argv[2];

import { Instance } from '../app';

export async function connection(req, res, next) {
  const instance = Instance;
  const qrCode = instance.instances[port].instance.qrCode;

  if (qrCode != "") {
    return res.status(200).send(JSON.stringify({ accountStatus: false, state: "disconnected", message: "Phone disconnected from API. Use /qrcode to associate!" }));
  } else {
    return next();
  }
}

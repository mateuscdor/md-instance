const port = process.argv[2];

// import QRCode from 'qrcode';
import { delay } from '@adiwajshing/baileys';

import { Instance } from '../app';

export async function checkQrcode(req, res, next) {

  const instance = Instance;
  const qrCode = instance.instances[port].instance.qrCode;

  if (qrCode != "") {
    await delay(500);
    return res.status(200).end(JSON.stringify({ accountStatus: "got qr code", state: "disconnected", qrCode: qrCode }));
  } else {
    await delay(500);
    return next();
  }

}

export async function checkQrcodeImg(req, res, next) {

  const instance = Instance;
  const qrCode = instance.instances[port].instance.qrCode;

  if (qrCode != "") {
    return res.status(200).render('qrcode', { qrcode: qrCode });
  } else {
    return next();
  }

}

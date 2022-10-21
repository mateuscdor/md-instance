import express from 'express';
const router = express.Router();

// middlewares
import { authentication } from '../middlewares/auth';
import { checkQrcode, checkQrcodeImg } from '../middlewares/checkQrcode';

const middlewares = [authentication, checkQrcode];
const middlewaresA = [authentication, checkQrcodeImg];

router.get("/qrcode", middlewares, (req, res) => {
  return res.status(200).send(JSON.stringify({ accountStatus: true, state: "connected", message: "Cell phone connected and API in operation!" }));
});

router.get("/qrcodeimg", middlewaresA, (req, res) => {
  return res.status(200).send(JSON.stringify({
    accountStatus: true,
    state: "connected",
    message: "Cell phone connected and API in operation!"
  }));
});

export default router;

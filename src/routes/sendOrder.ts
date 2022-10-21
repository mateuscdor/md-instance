const port = process.argv[2];

import {
  MessageRelayOptions,
  delay,
  proto,
  generateWAMessageFromContent,
  prepareWAMessageMedia,
  MediaGenerationOptions,
  MessageGenerationOptionsFromContent
} from '@adiwajshing/baileys';

import { Instance } from '../app';

import express from "express";
const router = express.Router();

// middlewares
import { connection } from '../middlewares/connection';
import { authentication } from '../middlewares/auth';
import { checkJsonOrder } from '../middlewares/checkJson';
import { returnJid, checkJid } from '../middlewares/checkChat';

const middlewares = [connection, authentication, checkJsonOrder, checkJid];

router.post("/sendorder", middlewares, async (req, res) => {
  const instance = Instance;
  const socket = instance.instances[port].instance.socket;
  let data = req.body;
  let jid = returnJid();
  let thumb = await prepareWAMessageMedia({ image: { url: data.orderImage } }, { upload: socket?.waUploadToServer } as MediaGenerationOptions);
  // console.log(thumb.imageMessage.jpegThumbnail);
  // let arquivo = await prepareWAMessageMedia({ image: { url: data.productImage } }, { upload: socket?.waUploadToServer });
  const orderMessage = {
    //Crie um catálogo pelo celular de Andreia e capture orderId e Token
    orderId: data.orderId,
    token: data.token,
    // thumbnail: data.thumbnail ? data.thumbnail : thumb.imageMessage,
    thumbnail: thumb.imageMessage?.jpegThumbnail,
    itemCount: data.itemCount,
    status: "INQUIRY",
    surface: "CATALOG",
    message: data.message,
    orderTitle: data.title,
    sellerJid: socket?.user?.id.split(':')[0] + '@s.whatsapp.net',
    totalAmount1000: data.totalAmount1000,
    totalCurrencyCode: data.totalCurrencyCode,
    contextInfo:
    {
      //forwardingScore: 999, //Quando essa opção habilitada de score aparece em cima da mensagem enviada para o cliente: (Encaminhada)
      isForwarded: false,  //True: (Só aparece no aplicativo whats) toda vez que o cliente receber essa msg e ele for encaminhar para outra pessoa, vai aparecer em cima do encaminhamento dele a seguinte mensagem: ( ENCAMINHAMENTO COM FEQÛENCIA )                        
    },
    sendEphemeral: true,
  }
  await socket?.presenceSubscribe(jid);
  delay(500);
  await socket?.sendPresenceUpdate('composing', jid);
  delay(1000);
  const templateOrder = generateWAMessageFromContent(jid, proto.Message.fromObject({ "orderMessage": orderMessage }), {} as MessageGenerationOptionsFromContent);
  console.log(templateOrder);
  delay(500);
  const order = templateOrder.message;
  const send = await socket?.relayMessage(jid, order as proto.IMessage, { messageId: templateOrder.key.id } as MessageRelayOptions);
  const messageSent = send;
  return res.send(JSON.stringify({ accountStatus: true, chatID: jid, messageID: messageSent, message: "Order sent successfully!" }));
});

export default router;

const port = process.argv[2];

import {
  delay,
  proto,
  generateWAMessageFromContent,
  prepareWAMessageMedia,
  MessageRelayOptions,
  MessageGenerationOptionsFromContent,
  MediaGenerationOptions
} from '@adiwajshing/baileys';

import { Instance } from '../app';

import express from "express";
const router = express.Router();

// middlewares
import { connection } from '../middlewares/connection';
import { authentication } from '../middlewares/auth';
import { checkJsonProduct } from '../middlewares/checkJson';
import { returnJid, checkJid } from '../middlewares/checkChat';

const middlewares = [connection, authentication, checkJsonProduct, checkJid];

router.post("/sendproduct", middlewares, async (req, res) => {
  const instance = Instance;
  const socket = instance.instances[port].instance.socket;
  let data = req.body;
  let jid = returnJid();
  let thumb = await prepareWAMessageMedia({ image: { url: data.productImage } }, { upload: socket?.waUploadToServer } as MediaGenerationOptions);
  let arquivo = await prepareWAMessageMedia({ image: { url: data.productImage } }, { upload: socket?.waUploadToServer } as MediaGenerationOptions);
  let productMessage = {
    product: //message ProductSnapshot 
    {
      productImage: arquivo.imageMessage,
      productId: data.productId,
      title: data.title,
      description: data.description,
      currencyCode: data.currencyCode,
      priceAmount1000: data.priceAmount1000,
      retailerId: data.retailerId,
      url: data.url,
      productImageCount: data.productImageCount,
      firstImageId: data.firstImageId,
      salePriceAmount1000: data.salePriceAmount1000
    },
    businessOwnerJid: data.businessOwnerJid,
    catalog: //message CatalogSnapshot
    {
      catalogImage: thumb.imageMessage,
      title: data.titleCatalog,
      description: data.descriptionCatalog
    },
    body: data.body,
    footer: data.footer,
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
  const templateProduct = generateWAMessageFromContent(jid, proto.Message.fromObject({ "productMessage": productMessage }), {} as MessageGenerationOptionsFromContent);
  delay(500);
  let send = await socket?.relayMessage(jid, templateProduct.message as proto.IMessage, { messageId: templateProduct.key.id } as MessageRelayOptions);
  let messageSent = await send;
  return res.send(JSON.stringify({ accountStatus: true, chatID: jid, messageID: messageSent, message: "Product sent successfully!" }));
});

export default router;

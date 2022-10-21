const port = process.argv[2];
const TOKEN = process.argv[3];
const urlWebhook = process.argv[4];

// process.on('warning', e => console.warn("TESTANDO ERROR:", e.stack));
// process.setMaxListeners(0);

import makeWASocket, {
  WASocket,
  Browsers,
  AuthenticationState,
  // makeInMemoryStore,
  useMultiFileAuthState,
  fetchLatestBaileysVersion,
  DisconnectReason,
  delay,
  downloadContentFromMessage,
  // makeCacheableSignalKeyStore,
  proto,
  generateWAMessageFromContent,
  prepareWAMessageMedia,
  MessageRetryMap,
  UserFacingSocketConfig,
  Contact,
  ConnectionState,
  WAMessage,
  Chat,
} from '@adiwajshing/baileys';

import * as dotenv from "dotenv";
dotenv.config();

import fs from 'fs';
// import Logger from '@adiwajshing/baileys/lib/Utils/logger';
import pino from 'pino';

import path from "path";
import shell from "shelljs";

import https from 'https';
import axios from 'axios';
import { Boom } from '@hapi/boom'
import * as QRCode from "qrcode";

const sessions = path.join("sessions", `${port}`);
// const history = path.join("history", `${port}.store.json`);

import { MessageRetryHandler } from "./middlewares/retryHandler";

const logger = pino().child({ class: "MegaAPI" });
logger.level = 'silent';

const timestamp = new Date().getTime();

// const useStore = !process.argv.includes('--no-store');
// const doReplies = !process.argv.includes('--no-reply');
// const store = useStore ? makeInMemoryStore({ logger }) : undefined;

export interface ChatWithMessages extends Chat {
  id: string;
}

export interface Instance {
  socket?: ReturnType<typeof makeWASocket>;
  key: string;
  connectionState?: string;
  qrCode?: string;
  chats: ChatWithMessages[];
  contacts: Contact[];
  messages: WAMessage[];
  hasReceivedMessages: boolean;
  hasReceivedChats: boolean;
  qrcodeCount: number;
}

export class WhatsAppInstance {
  // store;
  public key: string = "";
  private authState: {
    state: AuthenticationState;
    saveCreds: () => Promise<void>;
  };

  private axiosClient = axios.create({
    baseURL: urlWebhook,
    httpsAgent: false
      ? new https.Agent({
        rejectUnauthorized: false,
      })
      : undefined,
  });

  msgRetryCounterMap: MessageRetryMap = {};

  async sendWebhookMessage(data: any) {
    this.axiosClient.post("", data).catch((e) => {
      return;
    });
  }

  public instance: Instance = {
    key: this.key,
    chats: [],
    contacts: [],
    messages: [],
    hasReceivedMessages: false,
    hasReceivedChats: false,
    qrcodeCount: 0
  };

  private socketConfig: UserFacingSocketConfig;

  msgHandler: MessageRetryHandler;
  constructor(key?: string) {
    this.key = String(key);
    this.msgHandler = new MessageRetryHandler();
    this.socketConfig;
  }

  async connect(): Promise<WhatsAppInstance> {
    this.authState = await useMultiFileAuthState(sessions);
    const { version, isLatest } = await fetchLatestBaileysVersion();

    this.socketConfig = {
      emitOwnEvents: true,
      printQRInTerminal: false, // false, true
      // connectTimeoutMs: 20000,
      // waWebSocketUrl: 'wss://web.whatsapp.com/ws/chat',
      // keepAliveIntervalMs: 25000,
      // defaultQueryTimeoutMs: undefined,
      // linkPreviewImageThumbnailWidth: 192,
      markOnlineOnConnect: false,
      // shouldSyncHistoryMessage: () => true,
      fireInitQueries: true,
      syncFullHistory: true,
      // version,
      version: [2, 2240, 7],
      browser: ['Windows', 'Google Chrome', '106.0.5249.119'],
      // browser: Browsers.baileys("Chrome"),
      msgRetryCounterMap: this.msgRetryCounterMap,
      // auth: {
      //   creds: this.authState.state.creds,
      //   keys: makeCacheableSignalKeyStore(this.authState.state.keys, logger),
      // },
      auth: this.authState.state,
      logger: logger,
      getMessage: this.msgHandler.messageRetryHandler,
    }

    // this.store = makeInMemoryStore({});
    // this.store?.readFromFile(history);

    // setInterval(() => {
    //   this.store?.writeToFile(history);
    // }, 10_000)

    this.instance.socket = makeWASocket(this.socketConfig);
    await this.setHandlers();
    // await this.authState.saveCreds();
    return this;
  }

  // Method to remove part after ":" in the jid
  makeUserId = (jid: string) => {
    return jid.split(":")[0] + "@s.whatsapp.net";
  };

  // Method to push msg to its corresponding chat
  pushMessage = (message: WAMessage) => {
    const chat = this.instance.chats.find(
      (chat) => chat.id === message.key.remoteJid && !message.key.fromMe
    );

    const newMsg = {
      key: message.message?.chat?.id,
      message,
    };

    if (chat) {
      chat.messages?.push(newMsg);
    }
  }

  getSelf() {
    return {
      key: this.key,
      user: this.instance.socket?.user,
      connectionState: this.instance.connectionState,
    };
  }

  // Method to get msgs from specific chat
  getMessages = (chatId: string) => {
    const jid = this.createId(chatId);
    return this.instance.messages.filter(
      (message) => message.key.remoteJid === jid
    );
  };

  getMessageById = (messageId: string) => {
    const id = messageId;
    return this.instance.messages.filter(
      (message) => message.key.id === id
    );
  };

  async setHandlers() {

    // Current socket
    const socket = this.instance.socket;

    // this.store.bind(socket?.ev);

    socket?.ev.process(
      async (events) => {
        // console.log("EVENTS:", events);

        // listen for when the auth credentials is updated
        if (events['creds.update']) {
          await this.authState.saveCreds();
        }

        // if (events['messaging-history.set']) {
        //   const { chats, contacts, messages, isLatest } = events['messaging-history.set'];
        //   // console.log(`recv ${chats.length} chats, ${contacts.length} contacts, ${messages.length} msgs (is latest: ${isLatest})`);
        //   const chatsWithMessages = chats.map((chat) => {
        //     return {
        //       ...chat,
        //       messages: []
        //     };
        //   });
        //   this.instance.chats.push(...chatsWithMessages);
        //   this.instance.contacts.push(...contacts);
        //   this.instance.messages.push(...messages);
        // }

        if (events['chats.set']) {
          const { chats } = events['chats.set'];
          const chatsWithMessages = chats.map((chat) => {
            return {
              ...chat,
              messages: []
            };
          });
          this.instance.chats.push(...chatsWithMessages);
        }

        if (events['messages.set']) {
          const { messages } = events['messages.set'];
          this.instance.messages.push(...messages);
        }

        if (events['contacts.set']) {
          const { contacts } = events['contacts.set'];
          this.instance.contacts.push(...contacts);
        }

        // Handle receiving initial contacts
        if (events['contacts.upsert']) {
          const contacts = events['contacts.upsert'];
          this.instance.contacts.push(...contacts);
        }

        // Handle new Chats
        if (events['chats.upsert']) {
          const chats = events['chats.upsert'];
          const chatsWithMessages = chats.map((chat) => {
            return {
              ...chat,
              messages: []
            };
          });
          this.instance.chats.push(...chatsWithMessages);
        }

        // Handle chat deletes
        if (events['chats.delete']) {
          const chats = events['chats.delete'];
          chats.map((chat) => {
            const index = this.instance.chats.findIndex((c) => c.id === chat);
            this.instance.chats.splice(index, 1);
          });
          const objChatsDeleted: any = { options: [], chatDeleted: [] };
          objChatsDeleted.options.push({ port: port });
          objChatsDeleted.chatDeleted.push(chats[0]);
          this.sendWebhookMessage(objChatsDeleted);
        }

        // on chat change
        if (events['chats.update']) {
          const chats = events['chats.update'];
          chats.map((chat) => {
            const index = this.instance.chats.findIndex((value) => value.id === chat.id);
            const PrevChat = this.instance.chats[index];
            this.instance.chats[index] = {
              ...PrevChat,
              ...chat,
            };
            if (index === -1) {
              const addChat = this.instance.chats[index] = {
                ...PrevChat,
                ...chat,
              };
              return this.instance.chats.unshift(addChat);
            }
          });
        }

        // on contact change
        if (events['contacts.update']) {
          const contacts = events['contacts.update'];
          contacts.map((contact) => {
            const index = this.instance.contacts.findIndex((value) => value.id === contact.id);
            const PrevContact = this.instance.contacts[index];
            this.instance.contacts[index] = {
              ...PrevContact,
              ...contact,
            };
            if (index === -1) {
              const addContact = this.instance.contacts[index] = {
                ...PrevContact,
                ...contact,
              };
              return this.instance.contacts.unshift(addContact);
            }
          });
        }

        // // Handle chat updates like name change, bla bla bla
        // if (events['chats.update']) {
        //   const chats: any = events['chats.update'];
        //   chats.map((chat: any) => {
        //     const index = this.instance.chats.findIndex((value) => value.id === chat.id);
        //     console.log("chats.index:", index)
        //     const orgChat = this.instance.chats[index];
        //     console.log("chats.orgChat:", orgChat)
        //     if (index != -1 && orgChat) {
        //       this.instance.chats.splice(index, 1);
        //       const addChat = this.instance.chats[index] = {
        //         ...orgChat,
        //         ...chat
        //       };
        //       this.instance.chats.splice(index, 1);
        //       return this.instance.chats.unshift(addChat);
        //     } else {
        //       const addChat = this.instance.chats[index] = {
        //         ...orgChat,
        //         ...chat
        //       };
        //       return this.instance.chats.unshift(addChat);
        //     }
        //   });
        // }

        // // Handle receiving initial contacts
        // if (events['contacts.update']) {
        //   const contacts: any = events['contacts.update'];
        //   contacts.map((contact: any) => {
        //     const index = this.instance.contacts.findIndex((value) => value.id === contact.id);
        //     console.log("contacts.index:", index)
        //     const orgContact = this.instance.contacts[index];
        //     console.log("contacts.orgChat:", orgContact)
        //     if (index != -1 && orgContact) {
        //       this.instance.contacts.splice(index, 1);
        //       const addContact = this.instance.contacts[index] = {
        //         ...orgContact,
        //         ...contact
        //       };
        //       this.instance.contacts.splice(index, 1);
        //       return this.instance.contacts.unshift(addContact);
        //     } else {
        //       const addContact = this.instance.contacts[index] = {
        //         ...orgContact,
        //         ...contact
        //       };
        //       return this.instance.contacts.unshift(addContact);
        //     }
        //   });
        // }

        // Handle Receipted messages
        if (events['message-receipt.update']) {
          const t: any = events['message-receipt.update'];
          t.map(async (m) => {
            if (m.key.remoteJid == "status@broadcast") return;
          });
          if (!t) return;
          this.instance.messages.unshift(...t);
          t.map(async (m) => {
            const objMessageReceipt: any = { options: [], messageReceipt: [] };
            objMessageReceipt.options.push({ port: port });
            objMessageReceipt.messageReceipt.push(m);
            this.sendWebhookMessage(objMessageReceipt);
          });
        }

        // Handle Deleted messages
        if (events['messages.delete']) {
          const d: any = events['messages.delete'];
          if (!d) return;
          const objMessageDelete: any = { options: [], messageDeleted: [] };
          objMessageDelete.options.push({ port: port });
          objMessageDelete.messageDeleted.push(d.keys);
          this.sendWebhookMessage(objMessageDelete);
        }

        // Handle new messages
        if (events['messages.upsert']) {
          const t = events['messages.upsert'];

          t.messages.map(async (m) => {
            if (m.key.remoteJid == "status@broadcast") return;
          });

          // @ts-ignore
          if (t.type == "prepend") {
            this.instance.messages.unshift(...t.messages);
          }

          if (t.type != "notify" && t.type != "append") return;

          // push new msg
          this.instance.messages.unshift(...t.messages);

          t.messages.map(async (m) => {
            if (!m.message) return; // if there is no text or media message

            const messageType = Object.keys(m.message)[0]; // get what type of message it is -- text, image, video

            // if messageType is protocolMessage, just dont send it
            if (["protocolMessage", "senderKeyDistributionMessage"].includes(messageType)) return;
            if (m.key.remoteJid == 'status@broadcast') return;

            const objMessage: any = { options: [], message: [] };
            objMessage.options.push({ port: port });
            objMessage.message.push(m);
            this.sendWebhookMessage(objMessage);
          });
        }

        // Handle ACK messages
        if (events['messages.update']) {
          const t = events['messages.update'];

          if (!t) return;

          t.map(async (m) => {
            if (m.key.remoteJid == 'status@broadcast') return;
          });

          this.instance.messages.unshift(...t);

          t.map(async (m) => {
            if (m.key.remoteJid == 'status@broadcast') return;
            const objMessageAck: any = { options: [], message: [] };
            objMessageAck.options.push({ port: port });
            objMessageAck.message.push(m);
            this.sendWebhookMessage(objMessageAck);
          });
        }

        // Groups upsert
        if (events['groups.upsert']) {
          const groupUpdate = events['groups.upsert'];
          const objMessageGroup: any = { options: [], message: [] };
          objMessageGroup.options.push({ port: port });
          objMessageGroup.message.push(groupUpdate);
          this.sendWebhookMessage(objMessageGroup);
          // this.sendWebhookMessage({
          //   instance_key: this.key,
          //   jid: this.instance.socket?.user?.id,
          //   messageType: "group-created",
          //   message
          // });
        }

        // Groups Update
        if (events['groups.update']) {
          const groupUpdate = events['groups.update'];
          const objMessageGroup: any = { options: [], message: [] };
          objMessageGroup.options.push({ port: port });
          objMessageGroup.message.push(groupUpdate);
          this.sendWebhookMessage(objMessageGroup);
        }

        // Groups Participant Update
        if (events['group-participants.update']) {
          const groupUpdate = events['group-participants.update'];
          const objMessageGroup: any = { options: [], message: [] };
          objMessageGroup.options.push({ port: port });
          objMessageGroup.message.push(groupUpdate);
          this.sendWebhookMessage(objMessageGroup);
        }

        // // Handle incoming call
        if (events['call']) {
          const call = events['call'];
          if (call[0].status != "ringing") {
            const objCall: any = { options: [], message: [] };
            objCall.options.push({ port: port });
            objCall.message.push(call);
            this.sendWebhookMessage(objCall);
          }
        }

        // On connect event
        if (events['connection.update']) {
          const update = events['connection.update'];

          const { connection, lastDisconnect, qr, isNewLogin } = update;

          // if (connection == "connecting") {
          //   return;
          // }

          if ((lastDisconnect?.error as Boom)?.output?.statusCode === DisconnectReason.timedOut) {
            console.log('TEMPO ESGOTADO E NÂO LIDO QRCODE!');
            await this.connect();
          }

          if (isNewLogin === true) {
            console.log('DISPARANDO PRIMEIRA CONEXÂO NO WHATSAPP!');
            await delay(3000);
            const id = this.getSelf();
            var objConnected: any = { options: [], info: [] };
            objConnected.options.push({ port: port });
            objConnected.info.push({ status: "connected", phone: id.user?.id, webhook: urlWebhook, message: "Phone connected to API!" });
            this.sendWebhookMessage(objConnected);
          }

          if (connection === "close") {

            // reconnect if not logged out
            if ((lastDisconnect?.error as Boom)?.output?.statusCode === DisconnectReason.forbidden) {
              // MegaAPI
              console.log("CELULAR BANIDO PELO WHATSAPP!!!");
              // await delay(2000);
              var objBan: any = { options: [], info: [] };
              objBan.options.push({ port: port });
              objBan.info.push({ status: "banned", message: "Phone banned from Whatsapp. Use /qrcode to associate another number!" });
              this.sendWebhookMessage(objBan);
              if (fs.existsSync(`${sessions}/creds.json`)) {
                fs.readdirSync(sessions).forEach(file => {
                  fs.unlinkSync(`${sessions}/` + file);
                });
              }
              // if (fs.existsSync(history)) {
              //   fs.unlinkSync(history);
              // }
              // @ts-ignore
              this.instance.socket.user = null;
              await delay(1000);
              await this.connect();
            } else if ((lastDisconnect?.error as Boom)?.output?.statusCode !== DisconnectReason.loggedOut) {
              console.log("REINICIALIZAÇÃO OBRIGATÓRIA!")
              await delay(1000);
              await this.connect();
            } else if ((lastDisconnect?.error as Boom)?.output?.statusCode === DisconnectReason.loggedOut) {
              console.log('WHATSAPP DESLOGADO PELO CELULAR!');
              // MegaAPI
              var objDisconnect: any = { options: [], info: [] };
              objDisconnect.options.push({ port: port });
              objDisconnect.info.push({ status: "disconnected", message: "Phone disconnected from API. Use /qrcode to associate!" });
              this.sendWebhookMessage(objDisconnect);
              if (fs.existsSync(`${sessions}/creds.json`)) {
                fs.readdirSync(sessions).forEach(file => {
                  fs.unlinkSync(`${sessions}/` + file);
                });
              }
              // if (fs.existsSync(history)) {
              //   fs.unlinkSync(history);
              // }
              // @ts-ignore
              this.instance.socket.user = null;
              await delay(1000);
              await this.connect();
            } else if ((lastDisconnect?.error as Boom)?.output?.statusCode === DisconnectReason.serviceUnavailable) {
              console.log('SERVIÇO DO WHATSAPP NÃO DISPONÍVEL!');
              // await delay(5000);
              await this.connect();
            } else {
              console.log('Code lastDisconnect:', (lastDisconnect?.error as Boom)?.output?.statusCode);
            }
          } else if (connection == 'open') {
            // await delay(2000);
            const id = this.getSelf();
            console.log("Telefone ->", id.user?.id);
            console.log("Webhook ->", urlWebhook);
            console.log("Token ->", TOKEN);
          };

          // Handle qrcode update
          if (qr) {
            if (this.instance.qrcodeCount >= 5) {
              this.instance.qrCode = undefined;
              this.instance.qrcodeCount = 0;
              this.instance.socket?.ev.removeAllListeners("connection.update");
              console.log("FALHA AO TENTAR LER QRCODE 5 VEZES!!!")
              return this.instance.socket?.end(
                new Boom("QR code limit reached, please login again", {
                  statusCode: DisconnectReason.badSession,
                })
              );
            }

            this.instance.qrcodeCount++;
            console.log("QrcodeCount:", this.instance.qrcodeCount);

            QRCode.toDataURL(qr).then((url: string) => {
              this.instance.qrCode = url;
            });
          } else {
            this.instance.qrcodeCount = 0;
            this.instance.qrCode = "";
          }
        };

      });
  }

  createId(jid: string) {
    if (jid.includes("@g.us") || jid.includes("@s.whatsapp.net") || jid.includes("@c.us")) {
      return jid;
    }
    return jid.includes("-") ? `${jid}@g.us` : `${jid}@s.whatsapp.net`;
  }

}

// const unexpectedErrorHandler = (error: any) => {
//   logger.error(error);
// }

// process.on('uncaughtException', unexpectedErrorHandler);
// process.on('unhandledRejection', unexpectedErrorHandler);

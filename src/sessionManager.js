// import {Client, LocalAuth} from 'whatsapp-web.js';
import WhatsappClient from "whatsapp-web.js";
export const sessionManager = (sessionId) => {
  console.log("started");
  console.log("sesisonId", sessionId);
  const client = new WhatsappClient.Client({
    puppeteer: {
      headless: true,
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
    },
    authStrategy: new WhatsappClient.LocalAuth({
      clientId: sessionId,
    }),
  });

  client.initialize();

  return client;
};

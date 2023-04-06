import events from 'events';
import express from "express";
import bodyParser from 'body-parser';
import { route } from "../src/routes.js";
import { sessionManager } from "./sessionManager.js";
import { clientSessionHelper, getClientInstance } from "./utils/helpers.js";
import cache from 'memory-cache';
import { stringify } from 'querystring';
import CircularJSON from 'circular-json';
events.EventEmitter.defaultMaxListeners = 100;
const app = express();
const port = 3000;

app.use(express.json());
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(bodyParser.json({ limit: '500mb' }));

export const clientSessionStore = cache;

app.post('/initSession/:phone', async (req, res) => {
    console.log("initSession started");
    try {
        console.log('sessionstoreage-->',stringify(clientSessionStore.Cache));
        const phoneNumber = req.params.phone;
        const existingClient = clientSessionStore.get(phoneNumber);
        const clientState = await existingClient?.getState();
        console.log({
            clientState
        })
        if(clientState === "CONNECTED") {
            return res.send({
                 "message": "User is already authenticated",
             })
         }
        const clientInstance = sessionManager(phoneNumber);
        clientSessionStore.put(phoneNumber, clientInstance);
        const resp = await clientSessionHelper(clientInstance)
        console.log({resp})
        
        if(resp.type === 'qr') {
            return res.send({
                "message": "QR Code Attached",
                "generatedQrCode": resp.code
            })
        } else if(resp.type === 'authenticated' || clientState === "CONNECTED") {
           return res.send({
                "message": "User is already authenticated",
            })
        } else {
            throw new Error(`Unexpected resp.type received : ${resp.type}`)
        }
    } catch (error) {
        console.log("initSession error", error);
        return res.send("negative");
    }
})

app.delete('/deleteSession/:phone', async(req, res) => {
    try {
        const phoneNumber = req.params.phone;
        const client = getClientInstance(phoneNumber);
        client.logout();
        clientSessionStore.del(phoneNumber);
        return res.send({
            "message": `Session for ${phoneNumber} deleted`
        })
    } catch (error) {
        console.log("deleteSession error", error);
        return res.send("negative");
    }
})
app.get('/getClientSessions', async (req, res) => {
    try {
        const keys = clientSessionStore.keys();
        const sessions = {};
        for (let i = 0; i < keys.length; i++) {
          const key = keys[i];
          const value = clientSessionStore.get(key);
          sessions[key] = sessions[key] = CircularJSON.stringify(value);
        }
        return res.send({
          status: "Success",
          sessions: sessions,
        });
      } catch (error) {
        console.log("getClientSessions error", error);
        return res.send({
          status: "Failure",
          message: `getClientSessions error: ${error}`,
        });
      }
  });
app.use('/', route)

app.listen(port, () => {
    console.log(`Express Server listing at port ${port}`)
})

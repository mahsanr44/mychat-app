import { base64regex } from "./constants.js";
import { clientSessionStore } from "../index.js";
// checks if string is base64 encoded
export const isImageValid = str => base64regex.test(str);   

export const getClientInstance = (sessionId) => {
    if(!sessionId) throw new Error(`getClientInstance: Invalid sessionId: ${sessionId}`);
    const client = clientSessionStore.get(sessionId);;
    if(!client) throw new Error(`getClientInstance: No existing session found for clientSessionId : ${sessionId}`);
    return client;
}

export const clientSessionHelper = async (client) => {
    return new Promise((resolve, reject) => {
        client.on('qr', code => {
            console.log("Event Type: qr");
            return resolve({type: 'qr', code})
        })
        client.on('authenticated', () => {
            console.log("Event Type: authenticated")
            return resolve({type: 'authenticated'})
        })
        client.on('disconnected', () => {
            console.log("Event Type: disconnected")
            client.logout();
            clientSessionStore.del(client.sessionId);
             return resolve({type: 'disconnected'})
        })
        client.on('auth_failure', () => {
            console.log("Event Type: auth_failure")
            // return resolve({type: 'auth_failure'})
        })
        client.on('ready', () => {
            console.log("Event Type: ready")
            // return resolve({type: 'ready'})
        })
    })
}


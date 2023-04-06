import express from 'express';
import { sendMessage, sendImage, bulkMessage, sendButton ,sendVideo,sendLocation,receiveMessage} from '../src/controllers/chat.js';
const route = express.Router();

route.post('/sendMessage/:clientSessionId', sendMessage)

route.post('/sendImage/:clientSessionId', sendImage);

route.post('/bulkMessage/:clientSessionId', bulkMessage);

route.post('/sendButton/:clientSessionId', sendButton);

route.post('/sendVideo/:clientSessionId', sendVideo)
route.post('/sendLocation/:clientSessionId', sendLocation)
route.post('/receiveMessage/:clientSessionId', receiveMessage)
export {
    route
};
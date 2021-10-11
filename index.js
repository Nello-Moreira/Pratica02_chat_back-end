import express from 'express';
import cors from 'cors';

import messages from './src/routes/messages.js';
import participants from './src/routes/participants.js';
import status from './src/routes/status.js';

import { removeInactiveParticipants } from './src/data/dataManager.js';

const server = express();
const port = 4000;

server.use(cors());
server.use(express.json());

server.get(participants.route, participants.getParticipants);
server.post(participants.route, participants.login);

server.get(messages.route, messages.getMessages);
server.post(messages.route, messages.postMessage);

server.post(status.route, status.refresh);

setInterval(removeInactiveParticipants, 15000);

server.listen(port);

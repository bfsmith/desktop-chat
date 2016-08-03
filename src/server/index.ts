import chat from './chat';
import { getConfig } from './config/config';
import ExpressInit from './express';
import * as socketio from 'socket.io';

let config = getConfig();

let app = ExpressInit(config);

const io: SocketIO.Server = socketio(app.http);
chat(io);

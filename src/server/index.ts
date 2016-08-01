import chat from './chat';
import * as socketio from 'socket.io';

const io: SocketIO.Server = socketio(1337);
chat(io);

import chat from '../server/chat';
import * as fs from 'fs';
import * as http from 'http';
import * as socketio from 'socket.io';

let server = http.createServer((req: http.IncomingMessage, res) => {
	let url = req.url;
	let path;
	if (fs.existsSync(__dirname + url) && fs.statSync(__dirname + url).isFile()) {
		path = __dirname + url;
	}	else if (fs.existsSync(__dirname + '/..' + url) && fs.statSync(__dirname + '/..' + url).isFile()) {
		path = __dirname + '/..' + url;
	} else if (fs.existsSync(__dirname + '/../..' + url) && fs.statSync(__dirname + '/../..' + url).isFile()) {
		path = __dirname + '/../..' + url;
	}	else {
		path = __dirname + '/index.html';
	}
	fs.readFile(path, (err: NodeJS.ErrnoException, data: Buffer) => {
		if (err) {
			res.writeHead(500);
			return res.end('Error loading index.html');
		}

		res.writeHead(200);
		res.end(data);
	});
});
const io: SocketIO.Server = socketio(server);
server.listen(3000);
chat(io);

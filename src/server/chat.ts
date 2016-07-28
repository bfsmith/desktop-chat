// import { Connection } from './connection';
import { MessageSubject } from '../shared/message.subject';
import { Status } from '../shared/status';
import { User } from '../shared/user';

let users: User[] = [];
// let connections = {};

// function broadcastUsers(io: SocketIO.Server) {
// 	io.emit('users', users.filter(u => u.getStatus() !== Status.Offline));
// }

export default function (io: SocketIO.Server) {
	io.on('connection', (socket) => {
		let user: User;
		console.log('Connect', socket.id);

		socket.on(MessageSubject.DISCONNECT, () => {
			const dc = users.find(u => u.getId() === socket.id);
			if (dc !== undefined) {
				socket.broadcast.emit(MessageSubject.DISCONNECTED, dc);
				console.log('Disconnect', socket.id);
			}
		});

		socket.on(MessageSubject.REGISTER, (client, response) => {
			if (client.name === undefined) {
				response({
					error: true,
					message: 'Name is required'
				});
				return;
			}

			// Register the user
			user = new User(socket.id);
			user.setName(client.name);
			user.setStatus(client.status || Status.Online);
			users.push(user);
			// Tell everyone else the user joined
			socket.broadcast.emit(MessageSubject.REGISTERED, user);
			response({
				error: false,
				user: user
			});
		});

		socket.on(MessageSubject.MESSAGE, (msg) => {
			io.emit(MessageSubject.MESSAGE, {user, message: msg});
		});
	});
}

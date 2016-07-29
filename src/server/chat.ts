// import { Connection } from './connection';
import { Conversation } from '../shared/conversation';
import { Message } from '../shared/message';
import { MessageSubject } from '../shared/message.subject';
import { SocketMessage } from '../shared/socket-message';
import { Status } from '../shared/status';
import { User } from '../shared/user';
import * as uuid from 'node-uuid';

/*
	/
		Register(name): SocketMessage<{ user: User, users: User[] }>
			- Send UserStatus(user) to all other users.
		Disconnect(): void
			- user.status = Offline
			- Send UserStatus(user) to all other users.
		StartConversation(userId...): SocketMessage<Conversation>
			- Create Conversation
			- Send NewConversation(Conversation) to userId's

*/

export default function (io: SocketIO.Server) {
	let users: User[] = [];
	let sockets: { [userid: string]: SocketIO.Socket } = {};
	// let secureTokens: { [key: string]: string } = {};
	let conversations: Conversation[] = [];

	io.on(MessageSubject.CONNECT, (socket) => {
		console.log('Connect', socket.id);

		// Done
		socket.on(MessageSubject.DISCONNECT, () => {
			const dc = users.find(u => u.getId() === socket.id);
			if (dc) {
				dc.setStatus(Status.Offline);
				if (dc !== undefined) {
					let userMsg = new SocketMessage<User>();
					userMsg.data = dc;
					socket.broadcast.emit(MessageSubject.USER_STATUS, userMsg);
					console.log('Disconnect', dc);
					let i = users.findIndex(u => u.getId() === socket.id);
					users.splice(i, 1);
				}
			}
		});

		// Done
		socket.on(MessageSubject.REGISTER, (client: { name: string, status?: Status }, response: Function) => {
			let result = new SocketMessage<{ user: User, users: User[] }>();
			if (client.name === undefined) {
				result.success = false;
				result.error = 'Name is required';
				return;
			}

			// socket.id = userid, assign socket to this userid
			sockets[socket.id] = socket;

			// Register the user
			let user = new User(socket.id);
			user.setName(client.name);
			user.setStatus(client.status || Status.Online);
			users.push(user);
			result.data = {
				user: user,
				users: users.filter(u => u.getStatus() !== Status.Offline),
			};
			// Tell everyone else the user is online
			let broadcastMsg = new SocketMessage<User>();
			broadcastMsg.data = user;
			socket.broadcast.emit(MessageSubject.USER_STATUS, broadcastMsg);
			// Send the result back to the user
			response(result);
		});

		// done
		socket.on(MessageSubject.START_CONVERSATION, (client: { users: string | string[] }, response: Function) => {
			let result = new SocketMessage<Conversation>();
			const user = users.find(u => u.getId() === socket.id);
			if (!user) {
				result.success = false;
				result.error = "Unknown user";
				response(result);
				return;
			}

			let convoUserIds = Array.isArray(client.users) ? <string[]>client.users : [<string>client.users];
			convoUserIds.push(user.getId());

			// Make sure there's at least 2 users in the convo
			if (convoUserIds.length < 2) {
				result.success = false;
				result.error = "A conversation must have at least 2 users.";
				response(result);
				return;
			}

			convoUserIds = convoUserIds.sort();
			let convoUsers = convoUserIds.map(userId => {
				return users.find(u => u.getId() === userId);
			});

			let conversation: Conversation = conversations.find(c => {
				if (c.getUsers().length !== convoUserIds.length) {
					return false;
				}
				for (let i = 0; i < c.getUsers().length; i += 1) {
					if (c.getUsers()[i].getId() !== convoUserIds[i]) {
						return false;
					}
				}
				return true;
			});
			if (conversation) {
				result.data = conversation;
				response(result);
				return;
			}
			conversation = new Conversation(uuid.v4(), convoUsers);
			result.data = conversation;
			conversations.push(conversation);
			// Send the user the conversation
			response(result);

			// Send all other users in the convo a message about it
			convoUserIds.filter(userid => userid !== user.getId()).forEach(convoUserId => {
				let sock = sockets[convoUserId];
				if (sock) {
					// Create a new one for each user in case we need to pass user specific information later
					let newConvoMessage = new SocketMessage<Conversation>();
					newConvoMessage.data = conversation;
					sock.emit(MessageSubject.START_CONVERSATION, newConvoMessage);
				}
			});
		});

		socket.on(MessageSubject.MESSAGE, (client: { message: any }, response: Function) => {
			console.log(MessageSubject.MESSAGE, client);
			
			try {
				client.message.createdDate = new Date();
				let message = Message.FROM_POJO(client.message);
				let conversation = getConversation(message.getConversationId(), message.getUserId());
				if (!conversation) {
					throw new Error('Conversation not found.');
				}
				conversation.getUsers().forEach(user => {
					let result = new SocketMessage<Message>();
					result.data = message;
					let userSocket = sockets[user.getId()];
					if (userSocket) {
						userSocket.emit(MessageSubject.MESSAGE, result);
					}
				});
				response(new SocketMessage<void>());
			} catch (error) {
				let result = new SocketMessage<void>();
				result.success = false;
				result.error = error;
				response(result);
				return;
			}
		});
	});

	function getConversation(conversationId: string, userId?: string): Conversation {
		let conversation = conversations.find(c => c.getId() === conversationId);
		if (!conversation) {
			return undefined;
		}
		if (userId === undefined || conversation.getUsers().some(u => u.getId() === userId)) {
			return conversation;
		}
		throw new Error('User is not part of the conversation.');
	}
}

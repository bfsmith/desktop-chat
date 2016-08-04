import { Conversation } from '../shared/conversation';
import { Message } from '../shared/message';
import { MessageSubject } from '../shared/message.subject';
import { SocketMessage } from '../shared/socket-message';
import { Status } from '../shared/status';
import { User } from '../shared/user';
import * as _ from 'lodash';
import * as uuid from 'node-uuid';

interface IUserInfo {
	password: string;
	user: User;
	socket: SocketIO.Socket;
}

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

export default function(io: SocketIO.Server) {
	let userAuth: {
		[username: string]: IUserInfo
	} = {};
	// let users: User[] = [];
	// let sockets: { [userid: string]: SocketIO.Socket } = {};
	// let secureTokens: { [key: string]: string } = {};
	let conversations: Conversation[] = [];

	io.on(MessageSubject.CONNECT, (socket) => {
		console.log('Connect', socket.id);
		let currentUser: User;

		// Done
		socket.on(MessageSubject.DISCONNECT, () => {
			if (currentUser && currentUser.getStatus() !== Status.Offline) {
				currentUser.setStatus(Status.Offline);
				if (currentUser !== undefined) {
					let userMsg = new SocketMessage<User>();
					userMsg.data = currentUser;
					socket.broadcast.emit(MessageSubject.USER_STATUS, userMsg);
					console.log('Disconnect', currentUser);
				}
			}
		});

		// Done
		socket.on(MessageSubject.REGISTER, (client: { name: string, password: string, status?: Status }, response: Function) => {
			let result = new SocketMessage<{ user: User, users: User[], conversations: Conversation[] }>();
			if (!client.name) {
				result.success = false;
				result.error = 'name is required';
				response(result);
				return;
			}
			if (!client.password) {
				result.success = false;
				result.error = 'password is required';
				response(result);
				return;
			}

			client.name = client.name.trim();
			client.password = client.password.trim();
			if (!isValidLogin(client.name, client.password)) {
				result.success = false;
				result.error = 'Invalid login';
				response(result);
				return;
			}

			let authedUser = userAuth[client.name];
			if (!authedUser) {
				let aUser = new User(socket.id);
				aUser.setName(client.name);
				aUser.setStatus(client.status || Status.Online);
				authedUser = {
					user: aUser,
					password: client.password,
					socket: socket,
				};
				userAuth[client.name] = authedUser;
			} else {
				authedUser.socket = socket;
			}
			currentUser = authedUser.user;
			let userConversations: Conversation[] = [];
			conversations.forEach(convo => {
				if (convo.getUsers().some(u => u.getId() == currentUser.getId())) {
					userConversations.push(convo);
				}
			});
			result.data = {
				user: currentUser,
				users: _.values(userAuth).map(u => u.user),
				conversations: userConversations,
			};

			// Register the user
			// Tell everyone else the user is online
			let broadcastMsg = new SocketMessage<User>();
			broadcastMsg.data = authedUser.user;
			socket.broadcast.emit(MessageSubject.USER_STATUS, broadcastMsg);
			// Send the result back to the user
			response(result);
		});

		// done
		socket.on(MessageSubject.START_CONVERSATION, (client: { users: string | string[] }, response: Function) => {
			let result = new SocketMessage<Conversation>();
			if (!currentUser) {
				result.success = false;
				result.error = "Unknown user";
				response(result);
				return;
			}

			let convoUserIds = Array.isArray(client.users) ? <string[]>client.users : [<string>client.users];
			convoUserIds.push(currentUser.getId());

			// Make sure there's at least 2 users in the convo
			if (convoUserIds.length < 2) {
				result.success = false;
				result.error = "A conversation must have at least 2 users.";
				response(result);
				return;
			}

			convoUserIds = convoUserIds.sort();
			let convoUsers = convoUserIds.map(userId => getUserByUserId(userId));

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
			convoUserIds.filter(userid => userid !== currentUser.getId()).forEach(convoUserId => {
				let sock = getSocketByUserId(convoUserId);
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
				let conversation = getConversation(message.getConversationId(), currentUser.getId());
				if (!conversation) {
					throw new Error('Conversation not found.');
				}
				conversation.addMessage(message);
				conversation.getUsers().forEach(user => {
					let result = new SocketMessage<Message>();
					result.data = message;
					let userSocket = getSocketByUserId(user.getId());
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

	function isValidLogin(username: string, password: string) {
		let user = userAuth[username];
		if (user) {
			return user.password === password;
		}
		return true;
	}

	// function getUserBySocketId(socketId: string): User {
	// 	let o = _.values(userAuth)
	// 		.find(v => v.socket.id == socketId);
	// 	return o ? o.user : undefined;
	// }

	function getUserByUserId(userId: string): User {
		let o = _.values(userAuth)
			.find(v => v.user.getId() === userId);
		return o ? o.user : undefined;
	}

	function getSocketByUserId(userId: string): SocketIO.Socket {
		let o = _.values(userAuth)
			.find(v => v.user.getId() === userId);
		return o ? o.socket : undefined;
	}
}

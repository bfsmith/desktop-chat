import { AppContextService } from '../services/app-context.service';
import { ConversationService } from '../services/conversation.service';
import { UserService } from '../services/user.service';
import { Conversation } from '../../shared/conversation';
import { Message } from '../../shared/message';
import { MessageSubject } from '../../shared/message.subject';
import { SocketMessage } from '../../shared/socket-message';
import { Status } from '../../shared/status';
import { User } from '../../shared/user';
import { Injectable, OnInit } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import * as io from 'socket.io-client';

@Injectable()
export class SocketService implements OnInit {
	private userCache: User[] = [];
	public users: Observable<User>;
	public messages: Observable<Message>;
	public conversations: Observable<Conversation>;
	private socket: SocketIOClient.Socket;
	private userSub: any;
	private conversationSub: any;
	private messageSub: any;

	constructor(private appContext: AppContextService) {
		this.users = new Observable<User>(sub => {
			this.userSub = sub;
			this.userCache.forEach(u => sub.next(u));
			this.userCache = undefined;
		});
		this.conversations = new Observable<Conversation>(sub => {
			this.conversationSub = sub;
		});
		this.messages = new Observable<Message>(sub => {
			this.messageSub = sub;
		});
		this.socket = io.connect(`http://localhost:3000/`);
		// this.initListeners(this.socket);
	}

	public ngOnInit() {
	}

	public register(name): Promise<User> {

		return new Promise<User>((resolve, reject) => {
			this.socket.emit(MessageSubject.REGISTER, { name: name }, (msg: SocketMessage<any>) => {
				console.log(MessageSubject.REGISTER, msg);
				// this.appContext.token = msg.token;
				try {
					this.appContext.user = User.FROM_POJO(msg.data.user);
					let users: User[] = msg.data.users.map(u => User.FROM_POJO(u));

					if (this.userSub) {
						users.forEach(user => this.userSub.next(user));
					} else {
						this.userCache.push(...users);
					}

					this.initListeners(this.socket);

					resolve(this.appContext.user);
				} catch (err) {
					reject(err);
					return;
				}
			});
		});
	}

	public startConversation(userIds: string[]): Promise<Conversation> {
		return new Promise<Conversation>((resolve, reject) => {
			this.socket.emit(MessageSubject.START_CONVERSATION, { users: userIds }, (msg: SocketMessage<Conversation>) => {
				console.log(MessageSubject.START_CONVERSATION, 'reply', msg);
				if (msg.success) {
					let conversation = Conversation.FROM_POJO(msg.data);
					this.conversationSub.next(conversation);
					resolve(conversation);
				} else {
					reject(msg.error);
				}
			});
		});
	}

	public sendMessage(conversationId: string, message: string): Promise<void> {
		return new Promise<void>((resolve, reject) => {
			let m = new Message(conversationId, this.appContext.user.getId(), message);
			this.socket.emit(MessageSubject.MESSAGE, { message: m }, (msg: SocketMessage<void>) => {
				console.log(MessageSubject.MESSAGE, msg);
				if (msg.success) {
					console.log(`Send a message "${message}" from user ${this.appContext.user.getId()} to conversation ${conversationId}.`);
					resolve();
				} else {
					reject(msg.error);
				}
			});
		});
	}

	private initListeners(socket) {
		// Disconnect
		socket.on(MessageSubject.DISCONNECT, () => {
			this.userSub.complete();
			this.conversationSub.complete();
			this.messageSub.complete();
		});

		// Users
		socket.on(MessageSubject.USER_STATUS, (msg: SocketMessage<any>) => {
			console.log(MessageSubject.USER_STATUS, msg);
			try {
				this.validateSecureMessage(msg);
				let u = User.FROM_POJO(msg.data);
				this.userSub.next(u);
			} catch (error) {
				console.error(error);
			}
		});

		// Conversation
		socket.on(MessageSubject.START_CONVERSATION, (msg: SocketMessage<any>) => {
			console.log(MessageSubject.START_CONVERSATION, msg);
			try {
				this.validateSecureMessage(msg);
				let c = Conversation.FROM_POJO(msg.data);
				this.conversationSub.next(c);
			} catch (error) {
				console.error(error);
			}
		});

		// Messages
		socket.on(MessageSubject.MESSAGE, (msg: SocketMessage<any>) => {
			console.log(MessageSubject.MESSAGE, msg);
			try {
				this.validateSecureMessage(msg);
				let u = Message.FROM_POJO(msg.data);
				this.messageSub.next(u);
			} catch (error) {
				console.error(error);
			}
		});
	}

	private validateSecureMessage(message: SocketMessage<any>) {
		// if (message.userId !== this.appContext.user.getId()
		// 	|| message.token !== this.appContext.token) {
		// 	throw new Error("Secure Message failed validation!");
		// }
	}
}

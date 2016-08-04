import { Conversation } from '../../shared/conversation';
import { Message } from '../../shared/message';
import { MessageSubject } from '../../shared/message.subject';
import { SocketMessage } from '../../shared/socket-message';
import { User } from '../../shared/user';
import { AppContextService } from '../services/app-context.service';
import { Injectable } from '@angular/core';
import { Observable, Subject } from '@reactivex/rxjs';
import * as io from 'socket.io-client';

@Injectable()
export class SocketService {
	public conversations: Observable<Conversation>;
	public messages: Observable<Message>;
	public users: Observable<User>;

	private conversationSubject: Subject<Conversation>;
	private messageSubject: Subject<Message>;
	private userSubject: Subject<User>;
	private socket: SocketIOClient.Socket;

	constructor(private appContext: AppContextService) {
		this.userSubject = new Subject<User>();
		this.users = this.userSubject;

		this.conversationSubject = new Subject<Conversation>();
		this.conversations = this.conversationSubject;

		this.messageSubject = new Subject<Message>();
		this.messages = this.messageSubject;

		if ((<any>window).ioUrl) {
			appContext.ioUrl = (<any>window).ioUrl;
		}
		this.socket = io.connect(this.appContext.ioUrl);
	}

	public register(name: string, password: string): Promise<User> {
		return new Promise<User>((resolve, reject) => {
			this.socket.emit(MessageSubject.REGISTER, { name: name, password: password },
				(msg: SocketMessage<{ user: User, users: User[], conversations: Conversation[] }>) => {
					console.log(MessageSubject.REGISTER, msg);

					if (!msg.success) {
						reject(msg.error);
						return;
					}
					// this.appContext.token = msg.token;
					try {
						this.appContext.user = User.FROM_POJO(msg.data.user);
						let users: User[] = msg.data.users.map(u => User.FROM_POJO(u));
						let conversations = msg.data.conversations.map(c => Conversation.FROM_POJO(c));

						users.forEach(user => this.userSubject.next(user));
						conversations.forEach(convo => this.conversationSubject.next(convo));

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
					this.conversationSubject.next(conversation);
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
			this.userSubject.complete();
			this.conversationSubject.complete();
			this.messageSubject.complete();
		});

		// Users
		socket.on(MessageSubject.USER_STATUS, (msg: SocketMessage<any>) => {
			console.log(MessageSubject.USER_STATUS, msg);
			try {
				this.validateSecureMessage(msg);
				let u = User.FROM_POJO(msg.data);
				this.userSubject.next(u);
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
				this.conversationSubject.next(c);
			} catch (error) {
				console.error(error);
			}
		});

		// Messages
		socket.on(MessageSubject.MESSAGE, (msg: SocketMessage<any>) => {
			console.log(MessageSubject.MESSAGE, msg);
			try {
				this.validateSecureMessage(msg);
				let m = Message.FROM_POJO(msg.data);
				this.messageSubject.next(m);
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

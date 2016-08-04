import { Conversation } from '../../shared/conversation';
import { Message } from '../../shared/message';
import { MessageSubject } from '../../shared/message.subject';
import { SocketMessage } from '../../shared/socket-message';
import { User } from '../../shared/user';
import { AppContextService } from '../services/app-context.service';
import { Injectable } from '@angular/core';
import { Observable, Subject, Subscriber } from '@reactivex/rxjs';
import * as io from 'socket.io-client';

@Injectable()
export class SocketService {
	public users: Subject<User>;
	public conversations: Subject<Conversation>;
	public messages: Subject<Message>;
	private socket: SocketIOClient.Socket;

	constructor(private appContext: AppContextService) {
		this.users = new Subject<User>();
		this.conversations = new Subject<Conversation>();
		this.messages = new Subject<Message>();
		if ((<any>window).ioUrl) {
			appContext.ioUrl = (<any>window).ioUrl;
		}
		this.socket = io.connect(this.appContext.ioUrl);
	}

	public register(name): Promise<User> {
		return new Promise<User>((resolve, reject) => {
			this.socket.emit(MessageSubject.REGISTER, { name: name }, (msg: SocketMessage<any>) => {
				console.log(MessageSubject.REGISTER, msg);
				// this.appContext.token = msg.token;
				try {
					this.appContext.user = User.FROM_POJO(msg.data.user);
					let users: User[] = msg.data.users.map(u => User.FROM_POJO(u));

					users.forEach(user => this.users.next(user));
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
					this.conversations.next(conversation);
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
			this.users.complete();
			this.conversations.complete();
			this.messages.complete();
		});

		// Users
		socket.on(MessageSubject.USER_STATUS, (msg: SocketMessage<any>) => {
			console.log(MessageSubject.USER_STATUS, msg);
			try {
				this.validateSecureMessage(msg);
				let u = User.FROM_POJO(msg.data);
				this.users.next(u);
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
				this.conversations.next(c);
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
				this.messages.next(m);
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

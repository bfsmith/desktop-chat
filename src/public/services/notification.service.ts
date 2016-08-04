import {ConversationService} from './conversation.service';
declare var Notification: any;

import { Conversation } from '../../shared/conversation';
import { Message } from '../../shared/message';
import { AppContextService } from './app-context.service';
import { SocketService } from './socket.service';
import { UserService } from './user.service';
import { Injectable } from '@angular/core';

@Injectable()
export class NotificationService {
	private enabled = false;
	private activeConversation: Conversation;

	constructor(private appContext: AppContextService,
		private userService: UserService,
		private conversationService: ConversationService,
		private socketService: SocketService) {
		console.log(Notification.permission);
		if (Notification.permission === "granted") {
			this.enabled = true;
		} else if (Notification.permission === "default") {
			Notification.requestPermission(function(permission) {
				if (permission === "granted") {
					this.enabled = true;
				}
			});
		}
		appContext.activeConversation.subscribe(conversation => {
			this.activeConversation = conversation;
		})
		socketService.messages.subscribe((message: Message) => {
			if (!this.activeConversation
				|| message.getConversationId() !== this.activeConversation.getId()) {
				this.createNotification(message);
			}
		});
	}

	private createNotification(message: Message): void {
		if (!this.enabled) {
			return;
		}
		let user = this.userService.getUser(message.getUserId());
		if (user) {
			let notification = new Notification(`New Message from ${user.getName()}`, {
				body: message.getMessage(),
				icon: "images/exclamation.png"
			});
			let timeout = setTimeout(() => {
				if (notification) {
					notification.close();
				}
			}, 5000);
			notification.onclick = (event) => {
				this.conversationService.getConversation(message.getConversationId())
					.then(convo => {
						if (convo) {
							this.appContext.setActiveConversation(convo);
						}
						clearTimeout(timeout);
						notification.close();
					})
					.catch(console.log.bind(console));
			};
		}
	}
}

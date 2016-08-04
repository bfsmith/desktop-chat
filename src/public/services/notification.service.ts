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

	constructor(private appContext: AppContextService,
		private userService: UserService,
		private socketService: SocketService) {
			console.log(Notification.permission);
			if (Notification.permission === "granted") {
				this.enabled = true;
			} else if (Notification.permission === "default") {
				Notification.requestPermission(function (permission) {
					if (permission === "granted") {
						this.enabled = true;
					}
				});
			}
		socketService.messages.subscribe((message: Message) => {
			if (!appContext.activeConversation
				|| message.getConversationId() !== appContext.activeConversation.getId()) {
				console.log("New message received!");
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
				body: message.getMessage()
			});
			notification.onclick = (event) => {
				alert("notification clicked!");
			};
		}
	}
}

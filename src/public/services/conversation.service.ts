import { Conversation } from '../../shared/conversation';
import { Message } from '../../shared/message';
import { AppContextService } from './app-context.service';
import { SocketService } from './socket.service';
import { UserService } from './user.service';
import { Injectable } from '@angular/core';

@Injectable()
export class ConversationService {
	private conversations: Conversation[] = [];

	constructor(private appContext: AppContextService,
		userService: UserService,
		private socketService: SocketService) {
		socketService.conversations.subscribe((conversation: Conversation) => {
			let existingConversation = this.getConversationInternal(conversation.getId());
			if (!existingConversation) {
				this.conversations.push(conversation);
			}
		});
		socketService.messages.subscribe((message: Message) => {
			let existingConversation = this.getConversationInternal(message.getConversationId());
			if (existingConversation) {
				existingConversation.addMessage(message);
			}
		});
	}

	public getConversation(id: string) {
		return Promise.resolve(this.getConversationInternal(id));
	}
	public getConversations(): Conversation[] {
		return this.conversations;
	}

	public startConversation(userIds: string[]): Promise<Conversation> {
		let allUserIds = userIds.concat(this.appContext.user.getId());
		let convo = this.conversations.find(c => {
			if (c.getUsers().length !== allUserIds.length) {
				return false;
			}
			// Count matching userIds and compare against the number of supplied userids
			let count = 0;
			for (let i = 0; i < c.getUsers().length; i++) {
				let found = false;
				for (let j = 0; j < c.getUsers().length; j++) {
					if (c.getUsers()[i].getId() === allUserIds[j]) {
						found = true;
						break;
					}
				}
				if (found) {
					count += 1;
				}
			}
			return count === allUserIds.length;
		});
		if (convo) {
			return Promise.resolve(convo);
		}

		return this.socketService.startConversation(userIds)
			.catch(error => {
				console.error(error);
				return Promise.reject(error);
			});
	}

	public addMessage(conversationId: string, message: string): Promise<void> {
		return this.socketService.sendMessage(conversationId, message);
	}

	private getConversationInternal(conversationId: string): Conversation {
		return this.conversations.find(c => c.getId() === conversationId)
	}
}

import { Conversation } from '../../shared/conversation';
import { User } from '../../shared/user';
import { GlobalMessage } from '../global-message';
import { Injectable } from '@angular/core';

@Injectable()
export class AppContextService {
	public ioUrl: string;
	public user: User;
	public activeConversation: Conversation;
	public globalMessages: GlobalMessage[] = [];

	public isCurrentUser(user: User) {
		return this.user.getId() === user.getId();
	}
	public isActiveConversation(conversation: Conversation) {
		return this.activeConversation !== undefined
			&& this.activeConversation.getId() === conversation.getId();
	}

	public addGlobalMessage(message: GlobalMessage) {
		this.globalMessages.push(message);
		if (message.getDuration() > 0 && message.getDuration() < 120) {
			setTimeout(() => {
				let index = this.globalMessages.findIndex(m =>
					m.getMessage() === message.getMessage()
					&& m.getSeverity() === message.getSeverity()
					&& m.getDuration() === message.getDuration());
				if (index >= 0) {
					this.globalMessages.splice(index, 1);
				}
			}, message.getDuration() * 1000);
		}
	}
}

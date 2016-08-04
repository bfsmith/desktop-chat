import { Conversation } from '../../shared/conversation';
import { User } from '../../shared/user';
import { GlobalMessage } from '../global-message';
import { ApplicationRef, Injectable } from '@angular/core';
import { Observable, Subject } from '@reactivex/rxjs';

@Injectable()
export class AppContextService {
	public ioUrl: string;
	public user: User;
	public activeConversation: Observable<Conversation>;
	public globalMessages: GlobalMessage[] = [];

	private activeConversationSubject: Subject<Conversation>;
	private activeConversationInternal: Conversation;

	constructor(private applicationRef: ApplicationRef) {
		this.activeConversationSubject = new Subject<Conversation>();
		this.activeConversation = this.activeConversationSubject;
	}

	public isCurrentUser(user: User) {
		return this.user.getId() === user.getId();
	}

	public setActiveConversation(conversation: Conversation) {
		this.activeConversationInternal = conversation;
		this.activeConversationSubject.next(conversation);
		// Force change detection
		this.applicationRef.tick();
	}

	public isActiveConversation(conversation: Conversation) {
		return this.activeConversationInternal !== undefined
			&& this.activeConversationInternal.getId() === conversation.getId();
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

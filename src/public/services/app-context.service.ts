import { Conversation } from '../../shared/conversation';
import { User } from '../../shared/user';
import { GlobalMessage } from '../global-message';
import { ApplicationRef, Injectable } from '@angular/core';
import { Observable, Subject } from '@reactivex/rxjs';
import * as _ from 'lodash';

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
		if (message.getDurationSeconds() > 0 && message.getDurationSeconds() < 120) {
			setTimeout(() => {
				this.removeGlobalMessage(message);
			}, message.getDurationSeconds() * 10000);
		}
	}
	public removeGlobalMessage(message: GlobalMessage) {
		_.remove(this.globalMessages, m =>
			m.getMessage() === message.getMessage()
			&& m.getSeverity() === message.getSeverity()
			&& m.getDurationSeconds() === message.getDurationSeconds());
	}
}

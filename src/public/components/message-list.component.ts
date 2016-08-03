import { Conversation } from '../../shared/conversation';
import { Message } from '../../shared/message';
import { User } from '../../shared/user';
import {AppContextService} from '../services/app-context.service';
import { ConversationService } from '../services/conversation.service';
import {UserService} from '../services/user.service';
import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
	moduleId: module.id,
	properties: ['conversation'],
	selector: 'message-list',
	styleUrls: ['message-list.component.css'],
	templateUrl: 'message-list.component.html',
})
export class MessageListComponent {
	private conversation: Conversation;
	private user: User;
	private message: string;
	private interval: any;

	constructor(
		private conversationService: ConversationService,
		private userService: UserService,
		private route: ActivatedRoute,
		private appContext: AppContextService) {
		this.user = appContext.user;
	}

	public sendMessage() {
		this.conversationService.addMessage(this.conversation.getId(), this.message)
			.then(() => {
				this.message = '';
			})
			.catch(console.error.bind(console));
	}

	public addMessage() {
		this.conversation.addMessage(new Message(this.conversation.getId(),
			this.conversation.getUsers()[0].getId(),
			"Adding a message..."));
	}

	public abbreviateUsername(user: User): string {
		return this.userService.abbreviateUsername(user);
	}

	public isCurrentUser(user: User): boolean {
		return this.appContext.isCurrentUser(user);
	}

	public filterCurrentUser(users: User[]) {
		return this.userService.filterCurrentUser(users);
	}

	public setConversation(conversation: Conversation) {
		if (this.interval) {
			clearInterval(this.interval);
		}
		this.conversation = conversation;
		// HACK
		// Electron somehow delays the event loop when not in focus. This delays the angular change watcher
		//  and can make it take several seconds for a new message to pop up when the app isn't in focus.
		//  This forces the app to continue running and speeds up changes.
		this.interval = setInterval(() => {
			this.conversation.getMessages();
		}, 100);
	}
}

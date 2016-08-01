import { Conversation } from '../../shared/conversation';
import { Message } from '../../shared/message';
import { User } from '../../shared/user';
import {AppContextService} from '../services/app-context.service';
import { ConversationService } from '../services/conversation.service';
import {UserService} from '../services/user.service';
import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
	moduleId: module.id,
	properties: ['conversation'],
	selector: 'message-list',
	styleUrls: ['message-list.component.css'],
	templateUrl: 'message-list.component.html',
})
export class MessageListComponent implements OnInit, OnDestroy {
	@Input()
	public conversation: Conversation;
	public user: User;
	private message: string;
	// private sub: any;

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

	public ngOnInit() {
		// this.sub = this.route.params.subscribe(params => {
		// 	if (params['conversationId'] !== undefined) {
		// 		let id: string = params['conversationId'];
		// 		this.conversationService.getConversation(id)
		// 			.then(conversation => {
		// 				this.conversation = conversation;
		// 				this.message = '';
		// 			})
		// 			.catch(console.error.bind(console));
		// 	} else {
		// 		this.conversation = null;
		// 		this.message = '';
		// 	}
		// });
	}

	public ngOnDestroy() {
		// this.sub.unsubscribe();
	}
}

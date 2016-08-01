import { Conversation } from '../../shared/conversation';
import { Message } from '../../shared/message';
import { User } from '../../shared/user';
import { AppContextService } from '../services/app-context.service';
import { ConversationService } from '../services/conversation.service';
import { UserService } from '../services/user.service';
import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
	moduleId: module.id,
	properties: ['conversation'],
	selector: 'conversation-list',
	styleUrls: ['conversation-list.component.css'],
	templateUrl: 'conversation-list.component.html',
})
export class ConversationListComponent implements OnInit, OnDestroy {
	public activeConversation: Conversation;
	public conversations: Conversation[];
	@Output()
	public select = new EventEmitter();

	constructor(
		private appContextService: AppContextService,
		private conversationService: ConversationService,
		private route: ActivatedRoute,
		private router: Router) {
	}

	public getOtherUsers(conversation: Conversation): User[] {
		let users: User[] = [];
		conversation.getUsers().forEach(user => {
			if (user.getId() !== this.appContextService.user.getId()) {
				users.push(user);
			}
		});
		return users;
	}

	public ngOnInit() {
		this.conversations = this.conversationService.getConversations();
	}

	public ngOnDestroy() {
	}

	public isActive(conversation: Conversation): boolean {
		return this.activeConversation !== undefined
			&& this.activeConversation.getId() == conversation.getId();
	}

	public gotoConversation(conversation: Conversation): void {
		this.activeConversation = conversation;
		this.select.emit(conversation);
		// let link = ['/conversation', conversationId];
		// this.router.navigate(link);
	}
}

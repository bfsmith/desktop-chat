import { Conversation } from '../../shared/conversation';
import { Message } from '../../shared/message';
import { User } from '../../shared/user';
import { AppContextService } from '../services/app-context.service';
import { ConversationService } from '../services/conversation.service';
import { UserService } from '../services/user.service';
import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
	moduleId: module.id,
	selector: 'user-list',
	// styleUrls: ['user-list.component.css'],
	templateUrl: 'conversation-list.component.html',
})
export class ConversationListComponent implements OnInit, OnDestroy {
	public conversations: Conversation[];
	private sub: any;

	constructor(
		private appContextService: AppContextService,
		private conversationService: ConversationService,
		private route: ActivatedRoute) {
			this.conversations = conversationService.getConversations();
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
		
	}

	public ngOnDestroy(){
		this.sub.unsubscribe();
	}
}


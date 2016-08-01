import { Conversation } from '../../shared/conversation';
import { User } from '../../shared/user';
import { AppContextService } from '../services/app-context.service';
import { ConversationListComponent } from './conversation-list.component';
import {MessageListComponent} from './message-list.component';
import { UserListComponent } from './user-list.component';
import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
	directives: [
		ConversationListComponent,
		MessageListComponent,
		UserListComponent,
	],
	moduleId: module.id,
	precompile: [
	],
	selector: 'chat',
	styleUrls: ['chat.component.css'],
	templateUrl: 'chat.component.html',
})
export class ChatComponent {
	public user: User;
	public conversation: Conversation;

	constructor(appContextService: AppContextService,
		router: Router) {
		this.user = appContextService.user;
		if (this.user === undefined) {
			router.navigate(['/register']);
		}
	}

	public openConversation(conversation) {
		this.conversation = conversation;
	}
}

import { ConversationListComponent } from './conversation-list.component';
import { RegisterComponent } from './register.component';
import { UserListComponent } from './user-list.component';
import { Conversation } from '../../shared/conversation';
import { User } from '../../shared/user';
import { APP_ROUTER_PROVIDERS, COMPONENTS } from '../routes';
import { AppContextService } from '../services/app-context.service';
import { ConversationService } from '../services/conversation.service';
import { UserService } from '../services/user.service';
import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { ROUTER_DIRECTIVES } from '@angular/router';

@Component({
	directives: [
		ConversationListComponent,
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


import { User } from '../../shared/user';
import { AppContextService } from '../services/app-context.service';
import { ConversationListComponent } from './conversation-list.component';
import { MessageListComponent } from './message-list.component';
import { Component } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';

@Component({
	directives: [
		ConversationListComponent,
		MessageListComponent,
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

	constructor(private appContextService: AppContextService,
		router: Router,
		title: Title) {
		this.user = appContextService.user;
		if (this.user === undefined) {
			router.navigate(['/register']);
			return;
		}
		title.setTitle("Desktop Chat - " + this.user.getName());
	}
}

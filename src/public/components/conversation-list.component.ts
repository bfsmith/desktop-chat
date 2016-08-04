import { Conversation } from '../../shared/conversation';
import { User } from '../../shared/user';
import { AppContextService } from '../services/app-context.service';
import { ConversationService } from '../services/conversation.service';
import {UserService} from '../services/user.service';
import { UserListComponent } from './user-list.component';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
	directives: [
		UserListComponent,
	],
	moduleId: module.id,
	properties: ['conversation'],
	selector: 'conversation-list',
	styleUrls: ['conversation-list.component.css'],
	templateUrl: 'conversation-list.component.html',
})
export class ConversationListComponent implements OnInit {
	public activeConversation: Conversation;
	public conversations: Conversation[];
	public userListVisible: boolean = false;

	constructor(
		private appContextService: AppContextService,
		private conversationService: ConversationService,
		private userService: UserService,
		private route: ActivatedRoute,
		private router: Router) {
		appContextService.activeConversation.subscribe(conversation => {
			this.activeConversation = conversation;
		});
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

	public isActive(conversation: Conversation): boolean {
		return this.activeConversation !== undefined
			&& this.activeConversation.getId() == conversation.getId();
	}

	public getBadgeIcon(conversation: Conversation): string {
		if (conversation.isGroupConversation()) {
			return "C";
		}
		let users = this.getOtherUsers(conversation);
		return this.userService.abbreviateUsername(users[0]);
	}

	public latestMessage(conversation: Conversation) {
		let messages = conversation.getMessages();
		return messages.length > 0
			? messages[messages.length - 1].getMessage()
			: undefined;
	}

	public gotoConversation(conversation: Conversation): void {
		this.appContextService.setActiveConversation(conversation);
	}

	public openUserList() {
		this.userListVisible = true;
	}

	public closeUserList(conversation?: Conversation) {
		this.userListVisible = false;
		if (conversation) {
			this.gotoConversation(conversation);
		}
	}
}

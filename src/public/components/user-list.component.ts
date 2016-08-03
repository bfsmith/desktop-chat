import { Conversation } from '../../shared/conversation';
import { User } from '../../shared/user';
import { ConversationService } from '../services/conversation.service';
import { UserService } from '../services/user.service';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';

@Component({
	moduleId: module.id,
	selector: 'user-list',
	styleUrls: ['user-list.component.css'],
	templateUrl: 'user-list.component.html',
})
export class UserListComponent implements OnInit {
	private users: User[] = [];
	private selectedUsers: User[] = [];
	@Output()
	public close = new EventEmitter();

	constructor(private userService: UserService,
		private conversationService: ConversationService) {
	}

	public ngOnInit() {
		this.users = this.userService.users;
	}

	public closePanel(conversation?: Conversation) {
		this.selectedUsers = [];
		this.close.emit(conversation);
	}

	public startConversation() {
		if (this.selectedUsers.length > 0) {
			this.conversationService.startConversation(this.selectedUsers.map(u => u.getId()))
				.then((c: Conversation) => this.closePanel(c))
				.catch(console.error.bind(console));
		} else {
			this.closePanel();
		}
	}

	public toggleUserSelected(user): void {
		let index = this.selectedUsers.findIndex(u =>
			u.getId() == user.getId());
		if (index >= 0) {
			this.selectedUsers.splice(index, 1);
		} else {
			this.selectedUsers.push(user);
		}
	}

	public isSelected(user): boolean {
		let index = this.selectedUsers.findIndex(u =>
			u.getId() == user.getId());
		return index >= 0;
	}
}

import { Status } from '../../shared/status';
import { User } from '../../shared/user';
import { ConversationService } from '../services/conversation.service';
import { UserService } from '../services/user.service';
import { Component, OnInit } from '@angular/core';

@Component({
	moduleId: module.id,
	selector: 'user-list',
	styleUrls: ['user-list.component.css'],
	templateUrl: 'user-list.component.html',
})
export class UserListComponent implements OnInit {
	private users: User[] = [];

	constructor(private userService: UserService,
		private conversationService: ConversationService) {
	}

	public ngOnInit() {
		this.users = this.userService.users;
	}

	public startConversation(user: User) {
		if (user.getStatus() !== Status.Offline) {
			this.conversationService.startConversation([user.getId()])
				.catch(console.error.bind(console));
		} else {
			alert(`${user.getName()} is offline.`);
		}
	}
}


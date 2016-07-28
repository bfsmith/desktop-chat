import { Status } from '../../shared/status';
import { User } from '../../shared/user';
import { UserService } from '../services/user.service';
import { Component, OnInit } from '@angular/core';

@Component({
	moduleId: module.id,
	selector: 'user-list',
	// styleUrls: ['user-list.component.css'],
	templateUrl: 'user-list.component.html',
})
export class UserListComponent implements OnInit {
	private users: User[] = [];

	constructor(private userService: UserService) {
	}
	
	public ngOnInit() {
		this.users = this.userService.getUsers();
	}
}


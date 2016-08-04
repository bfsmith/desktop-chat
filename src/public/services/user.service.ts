import { User } from '../../shared/user';
import { AppContextService } from './app-context.service';
import { SocketService } from './socket.service';
import { Injectable } from '@angular/core';

@Injectable()
export class UserService {
	public users: User[] = [];

	constructor(private appContext: AppContextService, socketService: SocketService) {
		socketService.users.subscribe(user => {
			if (!appContext.isCurrentUser(user)) {
				let existingUser = this.users.find(u => u.getId() === user.getId());
				if (existingUser) {
					existingUser.setName(user.getName());
					existingUser.setStatus(user.getStatus());
				} else {
					this.users.push(user);
				}
			}
		},
			error => console.error.bind(error),
			() => { /* Complete */ });
	}

	public abbreviateUsername(user: User): string {
		let name = user.getName();
		let matches = name.match(/([A-Z])/);
		if (matches && matches.length > 0) {
			return matches[0];
		}
		matches = name.match(/([a-z])/);
		if (matches && matches.length > 0) {
			return matches[0];
		}
		matches = name.match(/([0-9])/);
		if (matches && matches.length > 0) {
			return matches[0];
		}
		return name.charAt(0);
	}

	public filterCurrentUser(users: User[]) {
		return users.filter(u => !this.appContext.isCurrentUser(u));
	}

	public getUser(userId: string): User {
		if (this.appContext.user
			&& this.appContext.user.getId() === userId) {
			return this.appContext.user;
		}

		return this.users.find(u => u.getId() === userId);
	}
}

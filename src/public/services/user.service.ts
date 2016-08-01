// import { Status } from '../../shared/status';
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
				// if (user.getStatus() === Status.Offline) {
				// 	let i = this.users.findIndex(u => u.getId() === user.getId());
				// 	if (i >= 0) {
				// 		this.users.splice(i, 1);
				// 	}
				// } else {
				let existingUser = this.users.find(u => u.getId() === user.getId());
				if (existingUser) {
					existingUser.setName(user.getName());
					existingUser.setStatus(user.getStatus());
				} else {
					this.users.push(user);
				}
				// }
			}
		},
			error => console.error.bind(error),
			() => { /* Complete */ });
	}

	public abbreviateUsername(user: User): string {
		let abbreviation = '';
		let name = user.getName();
		let words = name.trim().split(' ');
		words.forEach(word => {
			let matches = name.match(/([A-Z])/);
			if (matches && matches.length > 0) {
				abbreviation += matches[0];
			} else {
				matches = name.match(/([a-z])/);
				if (matches && matches.length > 0) {
					abbreviation += matches[0];
				} else {
					abbreviation += word.charAt(0);
				}
			}
		});

		return abbreviation;
	}

	public filterCurrentUser(users: User[]) {
		return users.filter(u => !this.appContext.isCurrentUser(u));
	}
}

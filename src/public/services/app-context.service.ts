import { User } from '../../shared/user';
import { Injectable } from '@angular/core';

@Injectable()
export class AppContextService {
	public user: User;
	// public token: string;

	public isCurrentUser(user: User) {
		return this.user.getId() === user.getId();
	}
}

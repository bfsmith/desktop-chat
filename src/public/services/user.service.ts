import { Status } from '../../shared/status';
import { User } from '../../shared/user';
import { Injectable } from '@angular/core';

@Injectable()
export class UserService {
	private users: User[] = [];

	constructor() {
		for(let i = 0; i < 5; i++) {
			this.users.push(this.createUser());
		}
	}

  public getUsers(): User[] {
    return this.users;
  }

	private userCount: number = 1;
	private createUser(): User {
		let u = new User(Math.random().toString(36).substring(2, 8));
		u.setName('User ' + this.userCount);
		this.userCount += 1;
		u.setStatus(Status.Online);
		return u;
	}
}
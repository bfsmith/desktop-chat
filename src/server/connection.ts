import { User } from '../shared/user';

export class Connection {
	private name: string;
	private users: User[];

	public getName(): string {
		return this.name;
	}
	public setName(name: string): void {
		this.name = name;
	}

	public getUsers(): User[] {
		let users: User[] = [];
		this.users.map(u => {
			users.push(u);
		});
		return users;
	}

	public addUser(user: User): void {
		if (!this.users.some(u => u.name === user.name)) {
			this.users.push(user);
		}
	}

	public removeUser(user: User): void {
		let i = this.users.findIndex(u => {
			return u.name === user.name;
		});
		if (i !== undefined && i >= 0) {
			this.users.splice(i, 1);
		}
	}
}

import {Status} from './status';

export class User {
	public name: string;
	public status: Status = Status.Offline;

	constructor(private id: string) {
		if (id === undefined) {
			throw new Error('A user must have a valid id');
		}
	}

	public getId(): string {
		return this.id;
	}

	public getName(): string {
		return this.name;
	}
	public setName(name: string) {
		this.name = name;
	}

	public getStatus(): Status {
		return this.status;
	}
	public setStatus(status: Status) {
		this.status = status;
	}

	public static fromPojo(pojo: any): User {
		if (pojo.id !== undefined
				&& pojo.name !== undefined
				&& pojo.status !== undefined) {
			let u = new User(pojo.id);
			u.setName(pojo.name);
			u.setStatus(pojo.status || Status.Online);
			return u;
		}
		throw new Error("Pojo could not be converted to a User. " + pojo);
	}
}

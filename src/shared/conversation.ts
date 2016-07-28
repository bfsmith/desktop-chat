import {Message} from './message';
import {User} from './user';
import {UserMessage} from './user-message';

export class Conversation {
	private userMap: { [key: string]: User } = {};
	private messages: UserMessage[] = [];

	constructor(private id: string, private users: User[], messages?: Message[]) {
		users.sort((u1, u2) => u1.name.localeCompare(u2.getName()));
		users.forEach(user => {
			this.userMap[user.getId()] = user;
		});
		if (messages) {
			messages.forEach(message => {
				this.addMessage(message)
			});
		}
	}

	public getId(): string {
		return this.id;
	}
	public getUsers(): User[] {
		return this.users;
	}
	public getMessages(): UserMessage[] {
		return this.messages;
	}

	public addMessage(message: Message) {
		let user = this.userMap[message.getUserId()];
		if (user === undefined) {
			throw new Error(`Found message for user "${message.getUserId()}" but the user is not part of the conversation.`);
		}
		let um = new UserMessage(message, user);
		this.messages.push(um);
	}

	public fromPojo(pojo: any): Conversation {
		if (pojo.id !== undefined
				&& pojo.users !== undefined && Array.isArray(pojo.users)
				&& pojo.messages !== undefined && Array.isArray(pojo.messages)) {
			let users: User[] = pojo.users.map(user => User.fromPojo(user));
			let messages: Message[] = pojo.messages !== undefined && Array.isArray(pojo.messages)
				? pojo.messages.map(message => Message.fromPojo(message))
				: undefined;
			return new Conversation(pojo.id, users, messages);
		}
		throw new Error("Pojo could not be converted to a User. " + pojo);
	}
}

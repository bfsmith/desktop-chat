import {IMessage} from './imessage';
import {User} from './user';
import {UserMessage} from './user-message';

export class Conversation {
	private userMap: { [key: string]: User } = {};
	private messages: UserMessage[] = [];

	constructor(private id: string, private users: User[], messages?: IMessage[]) {
		users.sort((u1, u2) => u1.name.localeCompare(u2.getName()));
		users.forEach(user => {
			this.userMap[user.getId()] = user;
		});
		if (messages) {
			messages.forEach(message => this.addMessage(message));
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
	public isGroupConversation(): boolean {
		return this.getUsers().length > 2;
	}

	public addMessage(message: IMessage) {
		let user = this.userMap[message.getUserId()];
		if (user === undefined) {
			throw new Error(`Found message for user "${message.getUserId()}" but the user is not part of the conversation.`);
		}
		let um = new UserMessage(message, user);
		this.messages.push(um);
	}

	public static FROM_POJO(pojo: any): Conversation {
		if (pojo.id !== undefined
			&& pojo.users !== undefined && Array.isArray(pojo.users)
			&& pojo.messages !== undefined && Array.isArray(pojo.messages)) {
			let users: User[] = pojo.users.map(user => User.FROM_POJO(user));
			let messages: UserMessage[] = pojo.messages !== undefined && Array.isArray(pojo.messages)
				? pojo.messages.map(message => UserMessage.FROM_POJO(message))
				: undefined;
			return new Conversation(pojo.id, users, messages);
		}
		throw new Error("Pojo could not be converted to a User. " + pojo);
	}
}

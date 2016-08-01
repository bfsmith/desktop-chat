import { Message } from './message';
import { User } from './user';

export class UserMessage {
	constructor(private message: Message, private user: User) {
	}

	public getConversationId(): string {
		return this.message.getConversationId();
	}
	public getUserId(): string {
		return this.message.getUserId();
	}
	public getMessage(): string {
		return this.message.getMessage();
	}
	public getCreatedDate(): Date {
		return this.message.getCreatedDate();
	}

	public getUser(): User {
		return this.user;
	}
}

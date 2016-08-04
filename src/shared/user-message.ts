import { IMessage } from './imessage';
import { Message } from './message';
import { User } from './user';

export class UserMessage implements IMessage {
	constructor(private message: IMessage, private user: User) {
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

	public static FROM_POJO(pojo: any): UserMessage {
		if (pojo.message !== undefined
			&& pojo.message.conversationId !== undefined
			&& pojo.user !== undefined) {
			return new UserMessage(Message.FROM_POJO(pojo.message), User.FROM_POJO(pojo.user));
		}
		throw new Error("Pojo could not be converted to a UserMessage. " + pojo);
	}
}

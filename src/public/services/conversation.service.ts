import { Conversation } from '../../shared/conversation';
import { Message } from '../../shared/message';
import { UserService } from './user.service';
import { Injectable } from '@angular/core';

@Injectable()
export class ConversationService {
	private conversations: Conversation[] = [];

	constructor(userService: UserService) {
		let u1 = userService.getUsers()[0];
		let u2 = userService.getUsers()[1];
		let messages = [
			new Message("1", u1.getId(), "Message 1 from u1!"),
			new Message("1", u1.getId(), "Message 2 from u1!"),
			new Message("1", u2.getId(), "Message 3 from u2!"),
		];
		this.conversations.push(new Conversation("1", [u1, u2], messages));


		let u3 = userService.getUsers()[2];
		messages = [
			new Message("2", u2.getId(), "Message 4 from u2!"),
			new Message("2", u3.getId(), "Message 5 from u3!"),
			new Message("2", u2.getId(), "Message 6 from u2!"),
		];
		this.conversations.push(new Conversation("2", [u2, u3], messages));
	}

	public getConversation(id: string) {
		return Promise.resolve(this.conversations.find(c => c.getId() === id));
	}
  public getConversations(): Conversation[] {
    return this.conversations;
  }
}
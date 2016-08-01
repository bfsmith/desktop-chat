export class Message {
	constructor(private conversationId: string, private fromUserId: string, private message: string, private createdDate?: Date) {
		this.createdDate = createdDate || new Date();
	}

	public getConversationId(): string {
		return this.conversationId;
	}
	public getUserId(): string {
		return this.fromUserId;
	}
	public getMessage(): string {
		return this.message;
	}
	public getCreatedDate(): Date {
		return this.createdDate;
	}

	public static FROM_POJO(pojo: any): Message {
		if (pojo.conversationId !== undefined
			&& pojo.fromUserId !== undefined
			&& pojo.message !== undefined) {
			return new Message(pojo.conversationId, pojo.fromUserId, pojo.message, pojo.createdDate);
		}
		throw new Error("Pojo could not be converted to a Message. " + pojo);
	}
}

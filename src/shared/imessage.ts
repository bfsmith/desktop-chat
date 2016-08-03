export interface IMessage {
	getConversationId(): string;
	getUserId(): string;
	getMessage(): string;
	getCreatedDate(): Date;
}

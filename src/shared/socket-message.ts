export class SocketMessage<T> {
	public success: boolean = true;
	public error: string;
	public data: T;
}

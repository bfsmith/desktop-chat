export class GlobalMessage {
	constructor(private severity: string, private message: string,
		private duration?: number) {
	}

	public getSeverity(): string {
		return this.severity;
	}
	public getMessage(): string {
		return this.message;
	}
	public getDuration(): number {
		return this.duration;
	}
}

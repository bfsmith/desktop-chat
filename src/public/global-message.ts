export enum Severity {
	Critical,
	Warning,
	Info
}

export class GlobalMessage {
	constructor(private severity: Severity,
		private message: string,
		private seconds?: number) {
	}

	public getSeverity(): Severity {
		return this.severity;
	}
	public getMessage(): string {
		return this.message;
	}
	public getDurationSeconds(): number {
		return this.seconds;
	}
}

import { GlobalMessage, Severity } from '../global-message';
import { AppContextService } from '../services/app-context.service';
import { Component } from '@angular/core';

@Component({
	moduleId: module.id,
	selector: 'global-messages',
	styleUrls: ['global-messages.component.css'],
	templateUrl: 'global-messages.component.html',
})
export class GlobalMessagesComponent {
	private messages: GlobalMessage[];
	constructor(private appContextService: AppContextService) {
		this.messages = appContextService.globalMessages;
	}

	public getCssClass(message: GlobalMessage) {
		return {
			critical: message.getSeverity() === Severity.Critical,
			warning: message.getSeverity() === Severity.Warning,
			info: message.getSeverity() === Severity.Info,
		};
	}

	public close(message: GlobalMessage) {
		this.appContextService.removeGlobalMessage(message);
	}
}

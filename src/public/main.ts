import { GlobalMessagesComponent } from './components/global-messages.component';
import { APP_ROUTER_PROVIDERS, COMPONENTS } from './routes';
import { AppContextService } from './services/app-context.service';
import { ConversationService } from './services/conversation.service';
import { NotificationService}  from './services/notification.service';
import { SocketService } from './services/socket.service';
import { UserService } from './services/user.service';

import { HashLocationStrategy, LocationStrategy } from '@angular/common';
import { Component } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { bootstrap } from '@angular/platform-browser-dynamic';
import { ROUTER_DIRECTIVES, Router } from '@angular/router';

@Component({
	directives: [
		ROUTER_DIRECTIVES,
		GlobalMessagesComponent
	],
	precompile: [
		COMPONENTS
	],
	providers: [
		// Moved to bootstrap so they are available to App constructor
	],
	selector: 'chat-app',
	templateUrl: 'main.html',
})
export class MainComponent {
	constructor(appContext: AppContextService,
		router: Router,
		title: Title,
		notifications: NotificationService) {
		title.setTitle("Desktop Chat");
		if (appContext.user === undefined) {
			router.navigate(['/register']);
		}
	}
}

bootstrap(MainComponent, [
	APP_ROUTER_PROVIDERS,
	{ provide: LocationStrategy, useClass: HashLocationStrategy },
	SocketService,
	AppContextService,
	NotificationService,
	UserService,
	ConversationService,
	Title
]);

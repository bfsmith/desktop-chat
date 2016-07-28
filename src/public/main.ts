import { UserListComponent } from './components/user-list.component';
import { APP_ROUTER_PROVIDERS, COMPONENTS } from './routes';
import { AppContextService } from './services/app-context.service';
import { ConversationService } from './services/conversation.service';
import { UserService } from './services/user.service';

import { Component } from '@angular/core';
import { bootstrap } from '@angular/platform-browser-dynamic';
import { ROUTER_DIRECTIVES } from '@angular/router';

@Component({
	directives: [
		ROUTER_DIRECTIVES,
		UserListComponent,
	],
	precompile: COMPONENTS,
	providers: [
		AppContextService,
		ConversationService,
		UserService,
	],
	selector: 'chat-app',
	styleUrls: ['main.css'],
	templateUrl: 'main.html',
})
export class MainComponent { }

bootstrap(MainComponent, [
	APP_ROUTER_PROVIDERS
]);

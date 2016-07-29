import { ConversationListComponent } from './components/conversation-list.component';
import { RegisterComponent } from './components/register.component';
import { UserListComponent } from './components/user-list.component';
import { APP_ROUTER_PROVIDERS, COMPONENTS } from './routes';
import { AppContextService } from './services/app-context.service';
import { ConversationService } from './services/conversation.service';
import { SocketService } from './services/socket.service';
import { UserService } from './services/user.service';

import { Component } from '@angular/core';
import { bootstrap } from '@angular/platform-browser-dynamic';
import { ROUTER_DIRECTIVES } from '@angular/router';
// import { Observable } from 'rxjs/Observable';

@Component({
	directives: [
		ROUTER_DIRECTIVES,
		ConversationListComponent,
		RegisterComponent,
		UserListComponent,
	],
	precompile: [
		COMPONENTS
	],
	providers: [
		// Moved to bootstrap so they are available to App constructor
	],
	selector: 'chat-app',
	styleUrls: ['main.css'],
	templateUrl: 'main.html',
})
export class MainComponent {
	public user: any;
	constructor(appContext: AppContextService, socketService: SocketService) {
		// this.user = appContext.user;
		socketService.register(Math.random().toString(36).substring(2, 6))
		.then(user => {
			this.user = user;
		})
		.catch(console.error.bind(console));
		
		// Observable Example
		/*
		let numbers = new Observable<number>(subscriber => {
			let count = 0;
			let interval = setInterval(() => {
				subscriber.next(count++);
				if (count > 10) {
					clearInterval(interval);
					subscriber.complete();
				}
			}, 100);
		});

		let sub = numbers.subscribe(val => {
				console.log(val);
			},
			error => {
				console.error(error);
			},
			() => {
				console.log("observable is done...");
			});
			*/
	}
}

bootstrap(MainComponent, [
	APP_ROUTER_PROVIDERS,
	SocketService,
	AppContextService,
	UserService,
	ConversationService
]);

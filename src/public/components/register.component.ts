import { Conversation } from '../../shared/conversation';
import { Message } from '../../shared/message';
import { User } from '../../shared/user';
import { AppContextService } from '../services/app-context.service';
import { SocketService } from '../services/socket.service';
import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
	moduleId: module.id,
	selector: 'register',
	// styleUrls: ['user-list.component.css'],
	templateUrl: 'register.component.html',
})
export class RegisterComponent {
	public name: string;

	constructor(private socketService: SocketService,
		appContext: AppContextService, private router: Router) {
	}

	public register() {
		console.log('registering', this.name);
		if (this.name !== undefined && this.name !== '') {
			this.socketService.register(this.name)
			.then(user => {
				this.router.navigate(['/chat']);
			});
		}
	}
}


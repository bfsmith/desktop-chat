import { AppContextService } from '../services/app-context.service';
import { SocketService } from '../services/socket.service';
import { Component } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';

@Component({
	moduleId: module.id,
	selector: 'register',
	styleUrls: ['register.component.css'],
	templateUrl: 'register.component.html',
})
export class RegisterComponent {
	public name: string;

	constructor(private socketService: SocketService,
		appContext: AppContextService, private router: Router,
		title: Title) {
		title.setTitle("Desktop Chat");
	}

	public register() {
		if (this.name !== undefined && this.name !== '') {
			this.socketService.register(this.name.trim())
				.then(user => {
					this.router.navigate(['/chat']);
				});
		}
	}
}

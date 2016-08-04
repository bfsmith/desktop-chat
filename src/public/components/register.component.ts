import { GlobalMessage, Severity } from '../global-message';
import { AppContextService } from '../services/app-context.service';
import { SocketService } from '../services/socket.service';
import { UserService } from '../services/user.service';
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
	private name: string;
	private password: string;
	private message: string;

	constructor(private socketService: SocketService,
		private appContext: AppContextService,
		private userService: UserService,
		private router: Router,
		title: Title) {
		title.setTitle("Desktop Chat");
	}

	public register() {
		if (this.name !== undefined && this.name.trim() !== ''
			&& this.password !== undefined && this.password.trim() !== '') {
			this.socketService.register(this.name.trim(), this.password.trim())
				.then(user => {
					this.router.navigate(['/chat']);
				})
				.catch(error => {
					this.appContext.addGlobalMessage(new GlobalMessage(Severity.Critical, error, 5));
					// this.message = error;
				});
		}
	}
}

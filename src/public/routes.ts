import { ChatComponent } from './components/chat.component';
import { RegisterComponent } from './components/register.component';
import { RouterConfig, provideRouter }	from '@angular/router';

const routes: RouterConfig = [
	{
		path: '',
		redirectTo: '/register',
		pathMatch: 'full'
	},
	{
		path: 'chat',
		component: ChatComponent
	},
	{
		path: 'register',
		component: RegisterComponent
	},
];

export const APP_ROUTER_PROVIDERS = [
	provideRouter(routes)
];

export const COMPONENTS = [
	ChatComponent,
	RegisterComponent
];

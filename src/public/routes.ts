import { ChatComponent } from './components/chat.component';
import { MessageListComponent } from './components/message-list.component';
import { RegisterComponent } from './components/register.component';
// import { MainComponent } from './main';
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
		path: 'conversation/:conversationId',
		component: MessageListComponent
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
	MessageListComponent,
	RegisterComponent
];

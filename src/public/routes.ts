import { MessageListComponent } from './components/message-list.component';
import { RouterConfig, provideRouter }	from '@angular/router';

const routes: RouterConfig = [
	{
		path: 'messages/:conversationId',
		component: MessageListComponent
	},
];

export const APP_ROUTER_PROVIDERS = [
	provideRouter(routes)
];

export const COMPONENTS = [
	MessageListComponent
];

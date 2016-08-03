// import * as bodyParser from 'body-parser';
import * as compression from 'compression';
import * as timeout from 'connect-timeout';
// import * as consolidate from 'consolidate';
// import * as cookieParser from 'cookie-parser';
import * as express from 'express';
import * as http from 'http';
import * as path from 'path';

import { IAppConfig } from './config/config';

export interface IServer {
	express: express.Express;
	http: http.Server;
}

export default function(config: IAppConfig): IServer {
	let app = express();

	// Make the public folder available
	app.use(express.static(path.resolve(__dirname, '..', 'public')));
	app.use('/shared', express.static(path.resolve(__dirname, '..', 'shared')));

	if (process.env.NODE_ENV === 'local' || process.env.NODE_ENV === 'local-development') {
		// console.log(path.resolve(__dirname, '..', '..', 'src'));
		app.use('/src', express.static(path.resolve(__dirname, '..', '..', 'src')));
		// Make all client files available for dev
		app.use('/node_modules', express.static('node_modules'));
	}

	// Request body parsing middleware should be above methodOverride
	// app.use(bodyParser.urlencoded({
	// 	extended: true
	// }));
	app.use(timeout('30s'));
	// app.use(bodyParser.json());
	// app.use(cookieParser());
	app.use(compression());

	const server = app.listen(config.port, () => {
		console.log("Listening on port", config.port);
	});

	return { express: app, http: server };
}

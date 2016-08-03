export interface IAppConfig {
	port: number;
	appName: string;
	debug?: boolean;
}

export function getConfig(): IAppConfig {
	if (!process.env.NODE_ENV) {
		process.env.NODE_ENV = 'local';
	}

	let environment = process.env.NODE_ENV;
	return require(`./${environment}`);
}

import * as electron from 'electron';
import * as path from 'path';
const app = electron.app;

// let windows: any = {};

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let win: Electron.BrowserWindow;

// function login() {
// 	let loginWin = new BrowserWindow({
// 		height: 200,
// 		width: 300,
// 		frame: false
// 	});

// 	windows.login = loginWin;

// 	loginWin.loadURL(`file://${__dirname}/app/login.html`);
// 	loginWin.on('closed', () => {
// 		// Dereference the window object, usually you would store windows
// 		// in an array if your app supports multi windows, this is the time
// 		// when you should delete the corresponding element.
// 		windows.login = undefined;
// 		createWindow();
// 	});
// }

function createWindow() {
	// Create the browser window.
	win = new electron.BrowserWindow({
		height: 600,
		width: 800,
		webPreferences: {
			preload: path.resolve(__dirname, 'electron-preload.js')
		}
	});

	win.loadURL(`file://${__dirname}/public/index.html`);

	// and load the index.html of the app.
	// win.showUrl(path.resolve(__dirname, 'public', 'index.html'), { ioUrl: 'http://localhost.att.com:3000' }, () => {
	// 	console.log('the window should be showing with the contents of the URL now');
	// });

	if (process.env.DEBUG == true) {
		// Open the DevTools.
		win.webContents.openDevTools();
	}

	// Emitted when the window is closed.
	win.on('closed', () => {
		// Dereference the window object, usually you would store windows
		// in an array if your app supports multi windows, this is the time
		// when you should delete the corresponding element.
		win = undefined;
	});
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow);

// Quit when all windows are closed.
app.on('window-all-closed', () => {
	// On macOS it is common for applications and their menu bar
	// to stay active until the user quits explicitly with Cmd + Q
	if (process.platform !== 'darwin') {
		app.quit();
	}
});

app.on('activate', () => {
	// On macOS it's common to re-create a window in the app when the
	// dock icon is clicked and there are no other windows open.
	if (win === undefined) {
		createWindow();
	}
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
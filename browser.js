const {app, BrowserWindow} = require('electron');
const {session} = require('electron');
const {parse} = require('qs');
const {url} = require('./options');

// Modify the user agent for all requests to the following urls.
const filter = {
	urls: ['https://signin.aws.amazon.com/saml']
};

// Const debug = /--debug/.test(process.argv[2])
const debug = false;

if (process.mas) {
	app.setName('SSO Sign in');
}

let mainWindow = null;

function initialize() {
	return new Promise((resolve, reject) => {
		function createWindow() {
			const windowOptions = {
				width: 400,
				minWidth: 400,
				height: 800,
				title: app.name
			};

			mainWindow = new BrowserWindow(windowOptions);
			mainWindow.loadURL(url);

			// Launch fullscreen with DevTools open, usage: npm run debug
			if (debug) {
				mainWindow.webContents.openDevTools();
				// MainWindow.maximize()
				require('devtron').install();
			}

			mainWindow.on('closed', () => {
				mainWindow = null;
			});

			session.defaultSession.webRequest.onBeforeRequest(filter, (details, callback) => {
				const contents = details.uploadData[0].bytes.toString();
				const formData = parse(contents);
				callback({cancel: true});

				require('./assume-role').aquireShortLivedCredentials(formData.SAMLResponse).then(resolve, reject);
			});
		}

		app.on('window-all-closed', () => {
			if (process.platform !== 'darwin') {
				app.quit();
			}
		});

		createWindow();
	});
}

module.exports = {initialize};

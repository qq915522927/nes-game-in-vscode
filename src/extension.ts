// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import * as path from 'path';

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	console.log('Congratulations, your extension "nes-game" is now active!');

	// The command has been defined in the package.json file
	// Now provide the implementation of the command with registerCommand
	// The commandId parameter must match the command field in package.json
	let disposable = vscode.commands.registerCommand('nes-game.helloWorld', () => {
		// The code you place here will be executed every time your command is executed

		// Display a message box to the user
		const panel = vscode.window.createWebviewPanel(
			'nesGame',
			'NES game',
			vscode.ViewColumn.One,
			{
				enableScripts: true
			}
		);
		const resRoot = vscode.Uri.file(path.join(context.extensionPath, 'browser/nes-game/dist/nes-game/'));
		let srcUrl = panel.webview.asWebviewUri(resRoot);
		panel.webview.html = getWebviewContent(srcUrl.toString());
		panel.webview.onDidReceiveMessage(
			message => {
			  switch (message.command) {
				case 'alert':
				  vscode.window.showErrorMessage(message.text);
				  return;
			  }
			},
			undefined,
			context.subscriptions
		  );
	});

	context.subscriptions.push(disposable);
}

// this method is called when your extension is deactivated
export function deactivate() {}

function getWebviewContent(resourceRoot: string) {
	return `
<!doctype html>
<html lang="en">

  <head>
    <meta charset="utf-8">
    <title>NesGame</title>
    <base href="/">
    <meta name="viewport" content="width=device-width, initial-scale=1">
	<link rel="icon" type="image/x-icon" href="favicon.ico">
	<script>
		window.vsCodeResourceUrl = "${resourceRoot}"
	</script>
    <script src="${resourceRoot}assets/js/jsnes.min.js"></script>
    <script src="${resourceRoot}assets/js/nes-embed.js"></script>
  </head>

  <body>
    <app-root></app-root>
    <script src="${resourceRoot}runtime.js" defer></script>
    <script src="${resourceRoot}polyfills.js" defer></script>
    <script src="${resourceRoot}styles.js" defer></script>
    <script src="${resourceRoot}scripts.js" defer></script>
    <script src="${resourceRoot}vendor.js" defer></script>
    <script src="${resourceRoot}main.js" defer></script>
  </body>

</html>` ;}
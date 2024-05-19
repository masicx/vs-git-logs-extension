// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import { spawn } from 'child_process';
import * as vscode from 'vscode';

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
	console.log('Congratulations, your extension "git-logs-extension" is now active!');

	const disposable = vscode.commands.registerCommand('git-logs-extension.gitReport', () => {
		vscode.window
			.showInputBox({
				placeHolder: 'Enter a date in the format YYYY-MM-DD'
			})
			.then((value) => {
				if (value) {
					runPython(value);
				}
			})
	});

	context.subscriptions.push(disposable);
}

function runPython(since: String) {
	// start a python process with a command to generate the git log
	console.log(`Generating report for ${since}`);
	var pythonPath = `${__dirname}\\git-logs.py`.replaceAll('\\', '/');
	console.log(`PYTHON PATH: "${pythonPath}"`);

	const paths = vscode.workspace.workspaceFolders?.[0]?.uri?.path.replace('/', ''); // remove the first '/'
	console.log(`WORKSPACE PATH: "${paths}"`);

	const command = `
import os;
os.system("py ${pythonPath} '${since}' -d ${paths}/../")`
	console.log(`COMMAND: ${command}`);
	vscode.window.showInformationMessage("Generating logs...");

	const pythonProcess = spawn('py', [
		'-c',
		command
	]);

	pythonProcess.stdout.on('data', (data) => {
		console.log(data.toString());
	});

	pythonProcess.stderr.on('data', (data) => {
		vscode.window.showErrorMessage(data.toString());
	});

	pythonProcess.on('close', async (code) => {
		if (code !== 0) {
			vscode.window.showErrorMessage('Error generating report');
		}

		vscode.window.showInformationMessage('Report generated');
		const generatedFilePath = `${paths}/../gitlogs.csv`; // Replace with the actual path to the generated file
		const doc = await vscode.workspace.openTextDocument(generatedFilePath);
		vscode.window.showTextDocument(doc);
	});

}

export function deactivate() { }

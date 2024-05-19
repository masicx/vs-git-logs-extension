// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import { spawn } from 'child_process';
import * as vscode from 'vscode';

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
	console.log('Congratulations, your extension "git-logs-report" is now active!');

	const disposable = vscode.commands.registerCommand('git-logs-report.gitReport', () => {
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
	console.log(`PYTHON PATH: "${__dirname}/../python/"`);
	console.log(`WORKSPACE PATH: "${vscode.workspace.workspaceFolders?.[0]?.uri?.fsPath}"`);


	const pythonProcess = spawn('python', [
		'-c',
		`import os;
		os.system("py ./python/git-logs.py '${since}' -d "'${vscode.workspace.workspaceFolders?.[0]?.uri?.fsPath}'/../"")`
	]);

	pythonProcess.stdout.on('data', (data) => {
		vscode.window.showInformationMessage(data.toString());
	});

	pythonProcess.stderr.on('data', (data) => {
		vscode.window.showErrorMessage(data.toString());
	});

	pythonProcess.on('close', (code) => {
		if (code !== 0) {
			vscode.window.showErrorMessage('Error generating report');
		}
	});
}

export function deactivate() { }

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
				placeHolder: 'Enter a date in the format YYYY-MM-DD',
				value: vscode.workspace.getConfiguration('git-logs-extension').get('since') as string,
			})
			.then((value) => {
				if (!value) {
					vscode.window.showErrorMessage('Please enter a date. Operation cancelled.');
					return;
				}
				runPython(value);
			})
	});

	context.subscriptions.push(disposable);
}

function runPython(since: String) {
	// start a python process with a command to generate the git log
	console.log(`Generating report for ${since}`);
	var pythonPath = `${__dirname}\\git-logs.py`.replaceAll('\\', '/');
	console.log(`PYTHON PATH: "${pythonPath}"`);
	if (!vscode.workspace.workspaceFolders) {
		vscode.window.showErrorMessage('No workspace found');
		return;
	}

	const paths = vscode.workspace.workspaceFolders.map(p => p.uri?.path.replace('/', '')); // remove the first '/'
	console.log(`WORKSPACE PATH: "${paths}"`);
	let authorCommand = vscode.workspace.getConfiguration('git-logs-extension').get('author') as string;

	if (authorCommand) {
		authorCommand = " -a " + authorCommand;
	}

	let pythonAlias = 'py';
	// check for os version, if os is mac then use py3 instead of py
	if (process.platform === 'darwin') {
		pythonAlias = 'py3';
	}
	const command = `
import os;
os.system("${pythonAlias} ${pythonPath} '${since}' -d ${paths.join(' ')} ${authorCommand}");`
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
			return;
		}

		vscode.window.showInformationMessage('Report generated');
		const generatedFilePath = `${paths[0]}/gitlogs.csv`; // Replace with the actual path to the generated file
		const doc = await vscode.workspace.openTextDocument(generatedFilePath);
		vscode.window.showTextDocument(doc);
	});

}

export function deactivate() { }

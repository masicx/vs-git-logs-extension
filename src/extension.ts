// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import { spawn } from 'child_process';
import * as vscode from 'vscode';
import { GitLogs, Config } from './lib/gitLogs';

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

				vscode.window.showInformationMessage('Generating report...');
				runScript(value);
			})
	});

	context.subscriptions.push(disposable);
}

function runScript(since: string) {
	// start gitLogs.ts with a command to generate the git log
	console.log(`Generating report for ${since}`);
	if (!vscode.workspace.workspaceFolders) {
		vscode.window.showErrorMessage('No workspace found');
		return;
	}

	let author = vscode.workspace.getConfiguration('git-logs-extension').get('author') as string;

	const paths = vscode.workspace.workspaceFolders.map(p => p.uri?.path.replace('/', '')); // remove the first '/'

	new GitLogs({ since,
		authors: author,
		directory: paths,
		verbose: true,
		csv_config: vscode.workspace.getConfiguration('git-logs-extension').get('csvColumns')}).execute();

	vscode.window.showInformationMessage('Report generated');
	const generatedFilePath = `${paths[0]}/gitlogs.csv`; // Replace with the actual path to the generated file
	if (vscode.workspace.getConfiguration('git-logs-extension').get('openGeneratedCSV') as boolean) {
		vscode.workspace.openTextDocument(generatedFilePath).then(doc => vscode.window.showTextDocument(doc));
	}

}

export function deactivate() { }

// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import { spawn } from 'child_process';
import * as vscode from 'vscode';
import { GitLogs, Config } from './lib/gitLogs';
import { getOrUpdateConfiguration } from './tools/configuration';

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
	const disposable = vscode.commands.registerCommand('git-logs-extension.gitReport', () => {
		getOrUpdateConfiguration('filters.since', 'Enter a date in the format YYYY-MM-DD').then(async (value) => {
			// if ask for author name is enabled, ask for author name
			let author = "";
			if (vscode.workspace.getConfiguration('git-logs-extension.filters').get('askForAuthor') as boolean) {
				author = await getOrUpdateConfiguration('filters.author', 'Enter an author');
			}

			runScript(value, author);
		});
	});

	context.subscriptions.push(disposable);
}

async function runScript(since: string, author: string) {
	// start gitLogs.ts with a command to generate the git log
	console.log(`Generating report for ${since}`);
	if (!vscode.workspace.workspaceFolders) {
		vscode.window.showErrorMessage('No workspace found');
		return;
	}

	const paths = vscode.workspace.workspaceFolders.map(p => p.uri?.path.replace('/', '')); // remove the first '/'
	vscode.window.showInformationMessage('Generating report...', 'Open Output').then(selected => {
		if (selected === 'Open Output') {
			outputChannel.show(true);
		}
	});
	const outputChannel = vscode.window.createOutputChannel("Git Logs Report");

	new GitLogs({
		since,
		authors: author,
		directory: paths,
		verbose: true,
		csv_config: vscode.workspace.getConfiguration('git-logs-extension').get('csv.columns')
	},
		outputChannel
	).execute();

	vscode.window.showInformationMessage('Report generated');
	const generatedFilePath = `${paths[0]}/gitlogs.csv`; // Replace with the actual path to the generated file
	if (vscode.workspace.getConfiguration('git-logs-extension').get('csv.autoOpen') as boolean) {
		vscode.workspace.openTextDocument(generatedFilePath).then(doc => vscode.window.showTextDocument(doc));
	}

}

export function deactivate() { }

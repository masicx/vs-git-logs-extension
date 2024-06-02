import * as vscode from 'vscode';

export async function getOrUpdateConfiguration(key: string, placeHolder: string, required: boolean = true): Promise<string> {
    return vscode.window
        .showInputBox({
            placeHolder: placeHolder,
            value: vscode.workspace.getConfiguration('git-logs-extension').get(key) as string,
        })
        .then((value) => {
            if (!value && required) {
                vscode.window.showErrorMessage('Please enter a value. Operation cancelled');
                throw Error('Please enter a value. Operation cancelled');
            }
            vscode.workspace.getConfiguration('git-logs-extension').update(key, value, true);
            return value as string;
        });
}

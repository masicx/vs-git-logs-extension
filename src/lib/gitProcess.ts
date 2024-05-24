import { execSync } from 'child_process';
import * as vscode from 'vscode';

export class GitProcess {
    private repo: string;

    constructor(repo: string) {
        this.repo = repo;
    }

    private execute(args: string[]): string {
        const command = args.join(' ');

        try {
            const output = execSync(command, { encoding: 'utf-8' });
            return output;
        } catch (error) {
            vscode.debug.activeDebugConsole.appendLine(`Failed to execute command: ${command}`);
        }

        return '';
    }

    public getRemoteBranches(): string[] {
        const output = this.execute(['git', '-C', this.repo, 'branch', '-r']);
        const branches = output.split('\n').map(branch => branch.trim()).filter(branch => branch !== '');
        for (const branch of branches) {
            const branchName = branch.replace('origin/', '');
            this.execute(['git', '-C', this.repo, 'branch', '--track', branchName, branch]);
        }
        return branches;
    }

    public pull(all: boolean = true): string {
        return this.execute(['git', '-C', this.repo, 'pull', all ? '--all' : '']);
    }

    public fetch(all: boolean = true): string {
        return this.execute(['git', '-C', this.repo, 'fetch', all ? '--all' : '']);
    }

    public getLogs(since: string, until: string, author: string = ''): string {
        const args = ['git', '-C', this.repo, '--no-pager', 'log', `--since="${since} 00:00:00"`];
        if (until) {
            args.push(`--until="${until} 23:59:59"`);
        }
        if (author) {
            args.push(`--author=${author}`);
        }
        args.push('--numstat');
        args.push('--all');
        args.push('--source');
        const output = this.execute(args);
        return output;
    }
}


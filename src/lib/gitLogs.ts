import { Author } from './author';
import { GitProcess } from './gitProcess';
import { createCsv } from './csvFile';
import { readFileSync } from 'fs';
import { join } from 'path';
import { Details } from './details';

export type Config = {
    directory: string[];
    verbose: boolean;
    since: string;
    until: string;
    authors: string;
    csv_config: object;
};

export class GitLogs {
    private config: Config;

    constructor(config: Partial<Config>) {
        this.config = {
            directory: [],
            verbose: false,
            since: '',
            until: '',
            authors: '',
            csv_config: {},
            ...config
        };
    }

    private printVerbose(value: string, isVerbose: boolean) {
        if (isVerbose) {
            console.log(`======> ${value}`);
        }
    }

    public async execute() {
        const authorsPerRepo: { [key: string]: { [key: string]: Author } } = {};

        for (const repository of this.config.directory) {
            this.printVerbose(`Updating local branches for ${repository}`, this.config.verbose);
            const process = new GitProcess(repository);

            this.printVerbose(process.getRemoteBranches().join('\n'), this.config.verbose);
            process.fetch(true);
            this.printVerbose(`>${process.pull(true)}`, this.config.verbose);

            authorsPerRepo[repository] = {};
            this.printVerbose(`Getting logs for ${repository}`, this.config.verbose);
            const output = process.getLogs(this.config.since, this.config.until, this.config.authors).replace(/b"/g, '');

            if (output.split('\n').length <= 1) {
                this.printVerbose(`>No changes detected!`, this.config.verbose);
                continue;
            }

            let currentAuthor: Author = new Author('', '');
            let currentDate = '';
            let currentDetails: Details = new Details();
            let currentBranch = '';
            let readComments = false;

            for (const line of output.split('\n')) {
                const splittedLine = line.replace(/| /g, '').trim().split(' ');
                if (/^commit/g.test(line.replace(/b'/g, ''))) {
                    currentBranch = splittedLine[1].split('\t')[1].replace('refs/heads/', '');
                    this.printVerbose(`line: ${line}`, this.config.verbose);
                    this.printVerbose(`Branch name: ${currentBranch}`, this.config.verbose);
                    continue;
                }

                if (/^Author:/g.test(splittedLine[0])) {
                    const authorName = splittedLine.slice(1, -1).join(' ');
                    if (!authorsPerRepo[repository][authorName]) {
                        authorsPerRepo[repository][authorName] = new Author(authorName, splittedLine.slice(-1)[0]);
                    }
                    currentAuthor = authorsPerRepo[repository][authorName];
                    continue;
                } else if (/^Date:/g.test(splittedLine[0])) {
                    readComments = true;
                    currentDate = splittedLine.slice(4, 7).join(' ');

                    if (!currentAuthor.details[currentDate]) {
                        currentAuthor.details[currentDate] = {};
                    }

                    if (!currentAuthor.details[currentDate][currentBranch]) {
                        currentAuthor.details[currentDate][currentBranch] = new Details();
                    }

                    currentDetails = currentAuthor.details[currentDate][currentBranch];
                    currentDetails.commits += 1;
                    currentDetails.branch = currentBranch;
                    currentDetails.comments += ' - ' + (currentDetails.comments !== '' && !currentDetails.comments.endsWith(' - ') ? ' ' : '');
                    continue;
                }

                if (/^[0-9]+\t/g.test(splittedLine[0])) {
                    readComments = false;
                    const changes = splittedLine[0].split(/\t/g);
                    currentDetails.filesChanged += 1;
                    currentDetails.insertions += parseInt(changes[0], 10);
                    currentDetails.deletions += parseInt(changes[1], 10);
                    continue;
                }

                if (/^-\\t/g.test(splittedLine[0])) {
                    currentDetails.filesChanged += 1;
                    continue;
                }

                if (readComments && splittedLine.length > 0) {
                    currentDetails.comments += splittedLine.join(' ') + ' ';
                    currentDetails.comments = currentDetails.comments.replace(' -	-', ' -');
                }
            }
        }

        this.printVerbose(`Creating CSV file`, this.config.verbose);
        const filepath = join(this.config.directory[0], 'gitlogs.csv');
        this.printVerbose(filepath, this.config.verbose);
        await createCsv(filepath, authorsPerRepo, this.config.csv_config);
    }
}


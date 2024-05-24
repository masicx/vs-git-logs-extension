import { createWriteStream, readFileSync, writeFileSync } from 'fs';
import { join } from 'path';
import { Author } from './author';
import { Details } from './details';

/**
 * Generates a CSV row data based on the provided information contained in csvYaml parameter.
 *
 * @param {string} repoName - The name of the repository.
 * @param {string} authorName - The name of the author.
 * @param {string} date - The date of the activity.
 * @param {Details} details - An instance of the Details class containing the activity details.
 * @param {object} csvColumns - The YAML file path for CSV creation.
 * @return {object} The CSV row data.
 */
export function getRowData(repoName: string, authorName: string, date: string, details: Details, csvColumns: object): { [key: string]: any } {
    const data: { [key: string]: any } = {};

    for (const [key, value] of Object.entries(csvColumns)) {
        if (value === 'repoName') {
            data[key] = repoName;
        } else if (value === 'branch') {
            data[key] = details.branch;
        } else if (value === 'authorName') {
            data[key] = authorName;
        } else if (value === 'date') {
            data[key] = date;
        } else if (value === 'commits') {
            data[key] = details.commits;
        } else if (value === 'filesChanged') {
            data[key] = details.filesChanged;
        } else if (value === 'insertions') {
            data[key] = details.insertions;
        } else if (value === 'deletions') {
            data[key] = details.deletions;
        } else if (value === 'comments') {
            data[key] = details.comments;
        } else {
            data[key] = value;
        }
    }

    return data;
}

/**
 * Creates a CSV file based on the provided data and YAML configuration.
 *
 * @param {string} fileName - The path to the CSV file.
 * @param {object} data - The data to be written to the CSV file.
 * @param {string} yamlFile - The YAML file path for CSV creation.
 */
export function createCsv(fileName: string, data: any, csvColumns: object) {
    const fieldNames = Object.keys(csvColumns);
    const writer = createWriteStream(fileName, { encoding: 'utf8' });
    fieldNames.forEach(field => writer.write(field + ', '));
    writer.write('\n');

    for (const repo of Object.keys(data)) {
        for (const authorKey of Object.keys(data[repo])) {
            const authorObject: Author = data[repo][authorKey];

            for (const date of Object.keys(authorObject.details)) {
                for (const branch of Object.keys(authorObject.details[date])) {
                    const details: Details = authorObject.details[date][branch];
                    const rowData = getRowData(repo, authorKey, date, details, csvColumns);
                    fieldNames.forEach(field => writer.write(rowData[field] + ', '));
                    writer.write('\n');
                }
            }
        }
    }
    writer.end();
}


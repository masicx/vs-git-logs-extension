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
export function getRowData(repoName: string, authorName: string, date: string, details: Details, csvColumns: Array<any>): { [key: string]: any } {
    const data: { [key: string]: any } = {};

    for (const column of csvColumns) {
        if (column.value === 'repoName') {
            data[column.key] = repoName;
        } else if (column.value === 'branch') {
            data[column.key] = details.branch;
        } else if (column.value === 'authorName') {
            data[column.key] = authorName;
        } else if (column.value === 'date') {
            data[column.key] = date;
        } else if (column.value === 'commits') {
            data[column.key] = details.commits;
        } else if (column.value === 'filesChanged') {
            data[column.key] = details.filesChanged;
        } else if (column.value === 'insertions') {
            data[column.key] = details.insertions;
        } else if (column.value === 'deletions') {
            data[column.key] = details.deletions;
        } else if (column.value === 'comments') {
            data[column.key] = details.comments;
        } else {
            data[column.key] = column.value;
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
export function createCsv(fileName: string, data: any, csvColumns: Array<any>) {
    const fieldNames = csvColumns.map((p: any) => p.key);
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


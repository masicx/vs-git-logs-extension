# git-logs-extension README

Generate the git logs for the workspace folders.

## Features

Generate the logs for the workspace folders.

For example:

![Command](https://github.com/masicx/vs-git-logs-extension/raw/master/assets/image.png)

The date can be any value defined in [git documentation](https://git-scm.com/docs/git-log#Documentation/git-log.txt---sinceltdategt)
![Date where it is going to start](https://github.com/masicx/vs-git-logs-extension/raw/master/assets/image2.png)

![Information](https://github.com/masicx/vs-git-logs-extension/raw/master/assets/image3.png)

![CSV file](https://github.com/masicx/vs-git-logs-extension/raw/master/assets/image4.png)

## Requirements

Git must be installed.

As optional you may use some extensions to make easier to read CSV files.

## Extension Settings

![Configurations](https://github.com/masicx/vs-git-logs-extension/raw/master/assets/configurations.png)
1. Open generated CSV file: if this value is set, the generated CSV file will be opened. By default, it will be opened.

1. Default author: if this value is set, the git logs will be filter by this value. If not, the logs will be generated for all the developers.

1. Default since: this value is to help to fill the prompt.

1. Default until: this value is always today.

1. Default CSV columns: This is an object that defines the columns and their respective values in the generated CSV file. The keys of the object represent the column names, and they can be named anything you desire. The values of the object, on the other hand, use placeholders that represent data from the git logs. For example, you can use `"date"` to represent the date of each commit, `"branch"` to represent the branch name, `"authorName"` to represent the author's name, and so on. Here's an example of how the object could be structured:

```json

[
    {
        "order": 3, // Determines the order of the columns
        "key": "Activity date",
        "value": "date"
    },
    {
        "order": 1,
        "key": "Branch",
        "value": "branch" // This will replaced with the name of the branch
    },
    {
        "order": 4,
        "key": "Comments",
        "value": "comments" // This will replaced with the commit message
    },
    {
        "order": 2,
        "key": "Developer",
        "value": "authorName" // This will replaced with the name of the author
    },
    {
        "order": 5,
        "key": "Repo name",
        "value": "repoName" // This will replaced with the name of the repository
    },
    {
        "order": 6,
        "key": "Total # files Changed",
        "value": "filesChanged" // This will replaced with the number of files changed
    },
    {
        "order": 7,
        "key": "Total # of Deletions",
        "value": "deletions" // This will replaced with the number of deletions
    },
    {
        "order": 8,
        "key": "Total # of Insertions",
        "value": "insertions" // This will replaced with the number of insertions
    },
    {
        "order": 9,
        "key": "Total # of commits",
        "value": "commits" // This will replaced with the number of commits
    },
    {
        "order": 10,
        "key": "A custom column", // You can add anything as titles to the columns
        "value": "A custom value" // Values not defined previously will be used as static values
    }
]
```


## Known Issues


## Release Notes

See [CHANGELOG.md](https://raw.githubusercontent.com/masicx/vs-git-logs-extension/master/CHANGELOG.md)

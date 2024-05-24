# git-logs-extension README

Generate the logs for all the developers. Use a default yml file to configurate the output.

## Features

Generate the logs for the workspace folders.

For example:

![command](https://github.com/masicx/vs-git-logs-extension/raw/master/assets/image.png)

The date can be any value defined in [git documentation](https://git-scm.com/docs/git-log#Documentation/git-log.txt---sinceltdategt)
![date where it is going to start](https://github.com/masicx/vs-git-logs-extension/raw/master/assets/image2.png)

![alt text](https://github.com/masicx/vs-git-logs-extension/raw/master/assets/image3.png)

![alt text](https://github.com/masicx/vs-git-logs-extension/raw/master/assets/image4.png)

## Requirements

Install git.

As optional you may use some extensions to make easier to read CSV files.

## Extension Settings

![alt text](https://github.com/masicx/vs-git-logs-extension/raw/master/assets/image.png)
1. Default author: if this value is set, the git logs will be filter by this value. If not, the logs will be generated for all the developers.

1. Default since: this value is to help to fill the prompt.

1. Default until: this value is always today.

1. Default CSV columns: This is an object that defines the columns and their respective values in the generated CSV file. The keys of the object represent the column names, and they can be named anything you desire. The values of the object, on the other hand, use placeholders that represent data from the git logs. For example, you can use `"date"` to represent the date of each commit, `"branch"` to represent the branch name, `"authorName"` to represent the author's name, and so on. Here's an example of how the object could be structured:

```json
{
    "Activity date": "date",
    "Branch": "branch",
    "Comments": "comments",
    "Developer": "authorName",
    "Repo name": "repoName", // this is the name of the repository
    "Total # files Changed": "filesChanged", // this is the number of files changed
    "Total # of Deletions": "deletions", // this is the number of deletions
    "Total # of Insertions": "insertions", // this is the number of insertions
    "Total # of commits": "commits" // this is the number of commits
}
```


## Known Issues


## Release Notes

See [CHANGELOG.md](https://raw.githubusercontent.com/masicx/vs-git-logs-extension/master/CHANGELOG.md)

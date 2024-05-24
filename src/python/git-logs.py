import os
import platform
import re
from author import Author
from details import Details
from gitProcess import GitProcess
from csvFile import createCsv
import argparse

def printVerbose(value, isVerbose) -> None:
    if isVerbose:
        print("======> {}".format(value))

def getAuthorsEmails(authorsPerRepository) -> str:
    authorsEmails = []
    for repo in authorsPerRepository:
        for author in authorsPerRepository[repo]:
            authorsEmails.append(authorsPerRepository[repo][author].email.replace("<", "").replace(">", ""))

    return authorsEmails


authorsPerRepo = {}

for repository in config["directory"]:
    print("Updating local branches for {}".format(repository))
    process = GitProcess(repository)

    printVerbose(process.GetRemoteBranches(), config["verbose"])
    process.Fetch(True)
    printVerbose(">{}".format(process.Pull(True)), config["verbose"])

    authorsPerRepo[repository] = {}
    print("Getting logs for {}".format(repository))
    output = process.GetLogs(config["since"], config["until"], config["authors"]).replace("b\"", "")

    currentAuthor: Author
    currentDate = ""
    filesChanged = 0
    logs = output.split("\\n")
    if logs.__len__() <= 1:
        printVerbose(">No changes detected!", config["verbose"])
        continue

    currentBranch = ""
    readComments = False
    skipAuthor = False
    currentDetails: Details
    for line in logs:
        splittedLine = line.replace("| ", "").lstrip().split(" ")
        if re.match("^commit", line.replace("b'", "")):
            currentBranch = splittedLine[1].split("\\t")[1].replace("refs/heads/", "")
            printVerbose("line: {}".format(line), config["verbose"])
            printVerbose("Branch name: {}".format(currentBranch), config["verbose"])
            continue

        if re.match("^Author:", splittedLine[0]):
            authorName = " ".join(splittedLine[1:-1])
            if authorName not in authorsPerRepo[repository]:
                authorsPerRepo[repository][authorName] = Author(
                    authorName, splittedLine[-1]
                )
            currentAuthor = authorsPerRepo[repository][authorName]
            continue

        if re.match("^Date:", splittedLine[0]):
            readComments = True
            currentDate = (
                splittedLine[4] + " " + splittedLine[5] + ", " + splittedLine[7]
            )

            if currentDate not in currentAuthor.details:
                currentAuthor.details[currentDate] = {}

            if currentBranch not in currentAuthor.details[currentDate]:
                currentAuthor.details[currentDate][currentBranch] = Details()

            currentDetails = currentAuthor.details[currentDate][currentBranch]
            currentDetails.commits += 1
            currentDetails.branch = currentBranch
            currentDetails.comments += " - " if currentDetails.comments != '' and not currentDetails.comments.endswith(" - ") else ""
            continue

        if re.match("^[0-9]+\\\\t", splittedLine[0]):
            readComments = False
            splittedLine = splittedLine[0].split("\\t")
            currentDetails.filesChanged += 1
            currentDetails.insertions += int(splittedLine[0])
            currentDetails.deletions += int(splittedLine[1])
            continue

        if re.match("^-\\\\t", splittedLine[0]):
            currentDetails.filesChanged += 1
            continue

        if readComments and len(splittedLine) > 0:
            currentDetails.comments += " ".join(splittedLine) + " "

print("Creating CSV file")
filepath = config["directory"][0] + "/" + "gitlogs.csv"
printVerbose(filepath, config["verbose"])
createCsv(filepath, authorsPerRepo, config["csv_config"])


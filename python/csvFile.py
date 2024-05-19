import csv
import yaml
from author import Author
from details import Details
import os

# check if a yaml file exists, if exist then do nothing else create it
def get_yaml_file(yaml_file):
    """
    Creates a YAML file if it does not exist and returns the data from the YAML file.

    Parameters:
        yaml_file (str): The path to the YAML file.

    Returns:
        dict: The data loaded from the YAML file where the key represents the column name and the value represents the data.
        The next list of values will be parsed from git data:
            repoName
            branch
            authorName
            date
            commits
            filesChanged
            insertions
            deletions
            comments
        Any other value will be used as text data.
    """
    yaml_data = {}
    # if the yaml_file not exists then create it
    if not os.path.exists(yaml_file):
        yaml_data = create_yaml_file(yaml_file)

    # load the yaml file
    with open(yaml_file, "r") as yaml_file_data:
        yaml_data = yaml.safe_load(yaml_file_data)

    # return the yaml_data if not empty
    return yaml_data if len(yaml_data) > 0 else create_yaml_file(yaml_file)

def create_yaml_file(yaml_file):
    """
    Creates a YAML file and writes YAML data to it.

    :param yaml_file: A string representing the path to the YAML file.
    :return: A dictionary containing the YAML data that was written to the file.
    """
    with open(yaml_file, "w") as yaml_file:
            yaml_data = {
                "Repo name": "repoName",
                "Branch": "branch",
                "Developer": "authorName",
                "Activity date": "date",
                "Total # of commits": "commits",
                "Total # files Changed": "filesChanged",
                "Total # of Insertions": "insertions",
                "Total # of Deletions": "deletions",
                "Comments": "comments"}
            yaml_file.write(yaml.dump(yaml_data))
    return yaml_data

def get_row_data(repoName, authorName, date, details: Details, yaml_data):
    """
    Generates a CSV row data based on the provided information contained in csv_yaml parameter.

    Parameters:
        repoName (str): The name of the repository.
        authorName (str): The name of the author.
        date (str): The date of the activity.
        details (Details): An instance of the Details class containing the activity details.
        csv_yaml (str): The YAML file path for CSV creation.

    Returns:
        None: This function does not return any value.
    """
    data = {}
    for key, value in yaml_data.items():
        if value == "repoName":
            data[key] = repoName
        elif value == "branch":
            data[key] = details.branch
        elif value == "authorName":
            data[key] = authorName
        elif value == "date":
            data[key] = date
        elif value == "commits":
            data[key] = details.commits
        elif value == "filesChanged":
            data[key] = details.filesChanged
        elif value == "insertions":
            data[key] = details.insertions
        elif value == "deletions":
            data[key] = details.deletions
        elif value == "comments":
            data[key] = details.comments
        else:
            data[key] = value
    return data

def createCsv(fileName: str, data, yaml_file) -> None:
    with open(fileName, mode="w", newline='') as csvFile:
        yaml_data = get_yaml_file(yaml_file)
        fieldNames = yaml_data.keys()
        writer = csv.DictWriter(csvFile, fieldnames=fieldNames)
        writer.writeheader()
        for repo in data:
            for authorKey in data[repo]:
                authorObject: Author = data[repo][authorKey]
                for date in authorObject.details:
                    for branch in authorObject.details[date]:
                        details: Details = authorObject.details[date][branch]
                        writer.writerow(get_row_data(repo, authorKey, date, details, yaml_data))

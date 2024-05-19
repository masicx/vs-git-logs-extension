class Details:
    commits: int = 0
    filesChanged: int = 0
    insertions: int = 0
    deletions: int = 0
    branch: str
    comments: str

    def __init__(self) -> None:
        self.commits = 0
        self.filesChanged = 0
        self.insertions = 0
        self.deletions = 0
        self.comments = ""
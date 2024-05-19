import subprocess


class GitProcess:
    def __init__(self, repo) -> None:
        self.repo = repo
        self.pipe = subprocess.PIPE

    def Execute(self, args) -> str:
        process = subprocess.Popen(args, stdout=self.pipe, stderr=self.pipe)
        stdoutput, stderror = process.communicate()
        return "{}{}".format(stdoutput, stderror)

    def GetRemoteBranches(self) -> list:
        output = self.Execute(["git", "-C", self.repo, "branch", "-r"])
        branches = list(map(str.strip, output.__str__().replace("b'", "").lstrip().split("\\n")[:-1]))
        for branch in branches:
            branchName = branch.replace("origin/", "")
            output = self.Execute(
                ["git", "-C", self.repo, "branch", "--track", branchName, branch]
            )
        return branches

    def Pull(self, all: bool = True) -> str:
        return self.Execute(["git", "-C", self.repo, "pull", "--all" if all else ""])

    def Fetch(self, all: bool = True) -> str:
        return self.Execute(["git", "-C", self.repo, "fetch", "--all" if all else ""])

    def GetLogs(self, since, until, author = "") -> str:
        arguments = ["git", "-C", self.repo, "--no-pager", "log", "--since=\"{} 00:00:00\"".format(since)]
        if until:
            arguments.append("--until=\"{} 23:59:59\"".format(until))

        if author:
            arguments.append("--author={}".format(author))

        arguments.append('--numstat')
        arguments.append('--all')
        arguments.append('--source')
        output = self.Execute(arguments)
        return output

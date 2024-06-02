# Change Log

## [1.2.0] - 2024-06-02

### Added
- Added new configuration for csv generation.
- Added output channel for git logs.
- Added new button for opening the output channel registered as 'Git Logs Report'.
![Git logs report](https://github.com/masicx/vs-git-logs-extension/raw/master/assets/image-1.png)
- Updated configuration schema.

## [1.1.3] - 2024-05-30

### Fix
- Filter by author was not properly working.

## [1.1.2] - 2024-05-29

### Fix

- Removed the path for the repository name in the generated CSV file.
- Commas are removed from commit message to avoid representation errors.

## [1.1.1] - 2024-05-25

### Added

- Added new configuration for opening the generated CSV file

### Fix

- Fix error when deletions count is showing NaN in the report
- Fix error when comments is displaying ' -   -' in the report

## [1.0.0] - 2024-05-24

- Initial release of the extension for git logs.
- Process all workspace folders.
- Configuration for default 'since' date
- Configuration for default author
- Configuration for default 'until' date
- Configuration for default CSV columns
- Removed dependencies of python.

## [Unreleased]

### Fix

- v0.1.4 Python alias is not working in Mac

### Added

- v0.1.0 Configuration for default 'since' date
- v0.1.0 Configuration for default author

### Fix error when the user doesn't set a 'since' date

- v0.1.0 Process all workspace folders.


- Initial release
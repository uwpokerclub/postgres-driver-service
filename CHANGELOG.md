# Changelog
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

<!--
### Added - for new features.
### Changed - for changes in existing functionality.
### Deprecated - for soon-to-be removed features.
### Removed - for now removed features.
### Fixed - for any bug fixes.
### Security - in case of vulnerabilities.
-->

## [Unreleased]

## [1.0.2] - 2020-11-23
### Fixed
- Fixed a bug where the query meta would not reset on a failed query (#1)

## [1.0.1] - 2020-11-08
### Fixed
- Fixed incorrect package main and types options

## [1.0.0] - 2020-11-08
### Added
- QueryBuilder class to automatically build SQL queries based on options passed in.
- DriverService class to easily interface with a postgres database, and easily perform queries against the database without writing any raw SQL.
- CHANGELOG
- README
- MIT License

[Unreleased]: https://github.com/asmahood/postgres-driver-service/compare/v1.0.2...HEAD
[1.0.2]: https://github.com/asmahood/postgres-driver-service/compare/v1.0.1...v1.0.2
[1.0.1]: https://github.com/asmahood/postgres-driver-service/compare/v1.0.0...v1.0.1
[1.0.0]: https://github.com/asmahood/postgres-driver-service/releases/tag/v1.0.0
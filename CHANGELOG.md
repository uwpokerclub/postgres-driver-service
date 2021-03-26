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

## [2.0.3] - 2021-03-25

### Fixed

- Fixed an issue where arguments were not being passed to query (#7)

## [2.0.2] - 2021-03-25

### Added

- Added QueryMod to exports (#6)

### Fixed

- Fixed type declarations that were missing from the build (#6)

## [2.0.1] - 2021-03-22

### Fixed

- Fixed exported objects in index file. (#5)

## [2.0.0] - 2021-03-21

### Added

- Added ConnectionPool which can be used to connect with a Postgres database. (#4)
- Added Query which can be used to perform different types of queries. (#4)
- Added various query mods (limit, offset, or, orderBy, where) to build queries with. (#4)
- Added pg as a dependency. You only need to provide a connection string to connect now. (#4)

### Removed

- Removed both DriverService and QueryBuilder classes. (#4)

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

[unreleased]: https://github.com/uwpokerclub/postgres-driver-service/compare/v2.0.3...HEAD
[2.0.3]: https://github.com/uwpokerclub/postgres-driver-service/compare/v2.0.2...v2.0.3
[2.0.2]: https://github.com/uwpokerclub/postgres-driver-service/compare/v2.0.1...v2.0.2
[2.0.1]: https://github.com/uwpokerclub/postgres-driver-service/compare/v2.0.0...v2.0.1
[2.0.0]: https://github.com/uwpokerclub/postgres-driver-service/compare/v1.0.2...v2.0.0
[1.0.2]: https://github.com/uwpokerclub/postgres-driver-service/compare/v1.0.1...v1.0.2
[1.0.1]: https://github.com/uwpokerclub/postgres-driver-service/compare/v1.0.0...v1.0.1
[1.0.0]: https://github.com/uwpokerclub/postgres-driver-service/releases/tag/v1.0.0

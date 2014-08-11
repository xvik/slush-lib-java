#Java library slush generator

[![License](http://img.shields.io/badge/license-MIT-blue.svg?style=flat)](http://www.opensource.org/licenses/MIT)

### About

The main goal is to simplify new [github](https://github.com) java library setup. 

Features:
* MIT license (hardcoded)
* Gradle build
* [Maven central](http://search.maven.org/) compatible artifacts (jar, sources, javadocs)
* Ready for spock tests
* [Bintray](https://bintray.com/) publication (may be published to maven central in bintray ui)
* [Travis-ci](https://travis-ci.org/) integration (CI and healthy badge)
* [Coveralls](http://coveralls.io/) integration (code coverage badge)

### Setup

Install [slush](http://slushjs.github.io/)

```bash
$ npm install -g slush
```

Install `slush-lib-java` globally

```bash
$ npm install -g slush-lib-java
```

### Usage

> General convention: project name == github project name == bintray package page

Create new folder for library
``
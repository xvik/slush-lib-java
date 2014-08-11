#Java library slush generator

[![License](http://img.shields.io/badge/license-MIT-blue.svg?style=flat)](http://www.opensource.org/licenses/MIT)

### About

The main goal is to simplify new [github](https://github.com) java library setup. 

Features:
* MIT license (hardcoded)
* Gradle build
* [Maven central](http://search.maven.org/) compatible artifacts (jar, sources, javadocs)
* Ready for [spock](https://code.google.com/p/spock/) tests
* [Bintray](https://bintray.com/) publication (may be published to maven central in bintray ui)
* [Travis-ci](https://travis-ci.org/) integration (CI and healthy badge)
* [Coveralls](http://coveralls.io/) integration (code coverage badge)

### Setup

Install [slush](http://slushjs.github.io/):

```bash
$ npm install -g slush
```

Install `slush-lib-java` globally:

```bash
$ npm install -g slush-lib-java
```

### Usage

> General convention: project name == github project name == bintray package page

Create new folder for library:

```bash
$ mkdir my-library
```

Run generator:

```bash
$ cd my-library && slush lib-java
```

Project setup ready, start coding!

### External services

> General convention: project name == github project name == bintray package page

Create github repo matching your library name and push project there.

In github progect settings go to `Webhooks & services` and add `travis-ci` service.

Go to [travis](https://travis-ci.org/) and enable your repo.

Go to [coveralls](http://coveralls.io/) and enable your repo.

Register on [bintray](https://bintray.com/) and create repository (repository name was one of generator questions). 

After first release, you will need to go to just ceraeted bintray package and get link to the latest version badge (insert it on your project's github readme page).

### Release

To install library to local maven repo use:

```groovy
gradlew install
```

To perform release use:

```groovy
gradlew release
```

Note: you can simulate release by enablying dryRun in build.gradle:

```groovy
dryRun = true
```
In this case package will not be uploaded to bintray. BUT task will fail if package is not yet created.

During first release bintray upload will fail.. it's a known issue - this time bintray package was created.. simply release one more time and everything will be ok.

### Maven central

You can configure bintray to publish to maven central: [read how](https://medium.com/@vyarus/the-hard-way-to-maven-central-c9e16d163acc).

To activate automatic release files signing, go to build.gradle and change release task deendencies:

```groovy
task release(dependsOn: [bintrayUpload, bintrayPublish] 
```

Now after release files will be auto signed on bitray and you will just need to click 'sync' button on package page to publish to maven central.

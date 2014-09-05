#Java library slush generator

[![License](http://img.shields.io/badge/license-MIT-blue.svg?style=flat)](http://www.opensource.org/licenses/MIT)
[![NPM version](http://img.shields.io/npm/v/slush-lib-java.svg?style=flat)](http://badge.fury.io/js/slush-lib-java)
[![Downloads](http://img.shields.io/npm/dm/slush-lib-java.svg?style=flat)](https://www.npmjs.org/package/slush-lib-java)

### About

The main goal is to simplify new [github](https://github.com) java library setup. 

Features:
* [MIT](http://opensource.org/licenses/MIT) license (hardcoded)
* [Gradle](http://www.gradle.org/) build
* [Maven central](http://search.maven.org/) compatible artifacts (jar, sources, javadocs)
* Ready for [spock](https://code.google.com/p/spock/) tests ([documentation](http://spock-framework.readthedocs.org/en/latest/))
* [Bintray](https://bintray.com/) publication (may be published to maven central using bintray ui)
* [Travis-ci](https://travis-ci.org/) integration (CI and healthy badge)
* [Coveralls](http://coveralls.io/) integration (code coverage badge)
* Code quality checks (pmd, checkstyle)
* Release process (like maven release)
 
[The story behind](https://medium.com/@vyarus/faster-way-to-java-opensource-d4fa78efcf16)

### Thanks to

* [Vladislav Bauer](https://github.com/vbauer) ([android-arsenal](http://android-arsenal.com/) author) for checkstyle config
* [Juan Roperto](https://github.com/jroperto) for pmd config

### Setup

Install [slush](http://slushjs.github.io/):

```bash
$ npm install -g slush
```

Install `slush-lib-java` globally:

```bash
$ npm install -g slush-lib-java
```

##### Update

You can check currently installed generator version using:

```bash
$ slush --help
```

It will print all installed generators with versions

To update lib use:

```bash
$ npm update -g slush-lib-java
```

### Bintray setup

Sign up to [bintray](https://bintray.com/).
You will need to create maven repository to package artifacts to (it's name is one of generator questions).

When you publish you package (release library), you can use it directly from your custom maven repository.
Better option is to request inclusion into jcenter repository (maven central alternative).
Also, you can publish your library to maven central. Project already generates valid artifacts for maven central, but
they also must be signed. If you register certificate on bintray, it will be able to sign files for you.
Project support files signing (bintray rest api called to sign just released files).

Read [instruction](https://medium.com/@vyarus/the-hard-way-to-maven-central-c9e16d163acc)

Add bintray user and key to `~/.gradle/gradle.properties`

```
bintrayUser=username
bintrayKey=secretkey
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

NOTE: May be launched on existing project to update files. In this case all changed files replacement will be asked.
If java sources directory exist, default package would not be generated. Also some files (like readme, changelog, gradle.properties etc)
are not updated (because they usually should not be updated after generation): it reduces number of override confirm questions.

### Generator defaults

Some generator questions most likely will not change between your libraries (author, email, github user, bintray repo).
You can specify defaults in `~/.generator` file.

Example:
```
libGroup = maven.group
libPackage = my.default.package
authorName = My Name
authorEmail = my@email.com
userName = githubNick
bintrayUser = bintrayUserName
libRepo = bintrayRepoName
bintraySignFiles = no
enableQualityChecks = yes
```

For boolean properties `yes` is recognized and everything else will be parsed as `no`

### Project usage

```bash
$ gradlew check
```

Runs code quality plugins. If quality checks were activated (asked during generation) do check before pushing to avoid 
build failures on travis. Moreover, it's easy to always keep everything clean instead of doing it before release.

```bash
$ gradlew checkOutOfDate
```

Checks if your project dependencies are actual and prints versions analysis report to console.

```bash
$ gradlew showDependenciesTree
```

Generates dependencies html report and launch it in default browser.
To analyze conflicts, click on dependency name to activate 
[dependencyInsight](http://www.gradle.org/docs/current/groovydoc/org/gradle/api/tasks/diagnostics/DependencyInsightReportTask.html) popup.

```bash
$ gradlew install
```

Installs library to local maven repository. Useful for referencing by other projects (for testing without releasing library).

```bash
$ gradlew release
```

Releases library. Read release process section below before performing first release.


### Project details

All project specific data (mostly inserted with generator) is in `build.gradle` file.
`project.ext` section contains configuration objects definitions. 
These definitions are extended using conventions (see `github.gradle`, `bintray.gradle`)

Used gradle plugins:
* [java](http://www.gradle.org/docs/current/userguide/java_plugin.html)
* [groovy](http://www.gradle.org/docs/current/userguide/groovy_plugin.html) to support spock tests
* [maven-publish](http://www.gradle.org/docs/current/userguide/publishing_maven.html) to generate pom and publish to maven repository
* [com.jfrog.bintray](https://github.com/bintray/gradle-bintray-plugin) for bintray publishing
* [org.10ne.rest](https://github.com/noamt/rest-gradle-plugin) to call bintray rest api for signing artifacts
* [com.github.ben-manes.versions](https://github.com/ben-manes/gradle-versions-plugin) to check dependencies versions updates
* [project-report](http://www.gradle.org/docs/current/userguide/project_reports_plugin.html) to generate dependency tree html report
* [jacoco](http://www.gradle.org/docs/current/userguide/jacoco_plugin.html) to build coverage report for coveralls
* [com.github.kt3k.coveralls](https://github.com/kt3k/coveralls-gradle-plugin) to send coverage report to coveralls
* [pmd](http://www.gradle.org/docs/current/userguide/pmd_plugin.html) to check code quality with [PMD](http://pmd.sourceforge.net/) tool
* [checkstyle](http://www.gradle.org/docs/current/userguide/checkstyle_plugin.html) to check code style rules with [checkstyle](http://checkstyle.sourceforge.net/index.html)
* [release](https://github.com/townsfolk/gradle-release) for release (see [article](http://www.sosaywecode.com/gradle-release-plugin/) for additional plugin details)

NOTE: [findbugs](http://www.gradle.org/docs/current/userguide/findbugs_plugin.html) plugin is commented in `quality.gradle` 
because of strage errors (maybe it will work in your case, try to enable it).

By default, checkstyle configured with simplified checks file. Modify it according to your needs.
[Sun conventions](http://java.sun.com/docs/codeconv/) file is also provided as reference
(see `gradle/config/checkstyle/sun_checks.xml`). You can replace default file in `quality.gradle`.

To suppress checkstyle warnings (required for some exceptional cases) use `@SuppressWarnings` annotation with 
value composed as `checkstyle:` prefix and lowercased checkstyle check name:

```java
@SuppressWarnings("checkstyle:classdataabstractioncoupling")
```

To suppress all checkstyle checks in class comments syntax could be used before class:

```java
// CHECKSTYLE:OFF
```

To suppress PMD violation use (in case PMD makes a mistake):

```java
@SuppressWarnings("PMD.checkName")
```

To suppress all PMD checks in class:

```java
@SuppressWarnings("PMD")
```

Travis is linux based build tool and so will use `gradlew` shell script.
You need to set executable flag on it if it's not set.

To do it on windows use git:

```bash
$ git update-index --chmod=+x gradlew
$ git commit -m "Changing file permissions"
$ git push
```

### External services

Create github repo matching your library name and push project there.

In github project settings go to `Webhooks & services` and add `travis-ci` service.

Go to [travis](https://travis-ci.org/) and enable your repo.

Go to [coveralls](http://coveralls.io/) and enable your repo.

Bintray and maven central badges are generated in readme, but commented (uncomment before release).

### Release process

#### First release

The following steps must be performed only before first library release.

Due to [known issue](https://github.com/bintray/gradle-bintray-plugin/issues/30) in bintray plugin, first upload will fail if package not yet exist.
So either create package manually or call:

```bash
$ gradlew bintrayUpload
```
To create package on bintray (it will fail but it's ok - package should be created).

Current bintray rest api did not allow to link github readme and changelog file automatically.
So you will have to go to your package page and edit package: fill in github repository name (user/repo-name) and
the name of changes file (CHANGELOG.md). After that click on 'readme' tab on package page and select 'github page'.
Do the same on 'release notes' tab.

After actual release press 'add to jcenter' button to request jcenter linking (required for maven central publication 
and even if you dont want to sync to maven central, linking to jcenter will simplify library usage for end users)

When releasing first time it's better to do 

```bash
$ gradlew install 
```

And validate generated pom file and jars (in local maven repository ~/.m2/repository/..).

NOTE: Release plugin requires access to git repository without credentials, so it's 
better to allow storing credentials when using git console.
Windows users with sysgit 1.8.1 and up could use: 

```bash
$ git config --global credential.helper wincred
```

To [avoid problems](https://github.com/townsfolk/gradle-release/issues/81).

Bintray and maven central badges are commented in readme - uncomment them (remove maven badge if not going to publish there)


#### General release process

Update `CHANGELOG.md`.

Push all changes before release and wait for `travis` to check build (wait for green badge).

Perform release:

```bash
$ gradlew release
```
 
Release will check that current copy is actual: no uncommitted/unversioned/unpushed changes, nothing newer is in remote repository.
You can start releasing either from snapshot version (1.0.0-SNAPSHOT) or from normal one (1.0.0).

During release, plugin will create tag (new github release appear) and update version in `gradle.properties`.

NOTE: Sometimes release plugin [did not set 'SNAPSHOT' postfix](https://github.com/townsfolk/gradle-release/issues/64) to new version.


If you use bintray maven synchronization, go to bintray package page, open 'maven' tab and press 'sync' button. 
Usually it works well, but sometimes it fails with strange errors (something like not able to close repository) - 
simply do sync one more time (eventually it will do it (of course, if your files valid))

#### If release failed

Nothing bad could happen. 

If bintray upload failed, you can always upload one more time.
If you uploaded bad version and want to re-release it, simply remove version files on bintray package version page and re-do release.

If release failed, but plugin already commit new version - you can release again from this state (no need to revert).

Release plugin changes only version in `gradle.properties` and creates git tag. 
Version could be reverted manually (by correcting file) and git tag could be also removed like this:

```bash
git tag -d release01 
git push origin :refs/tags/release01 
```

### Examples

* [guice-persist-orient](https://github.com/xvik/guice-persist-orient)
* [guice-ext-annotations](https://github.com/xvik/guice-ext-annotations)
* [guice-validator](https://github.com/xvik/guice-validator)
* [dropwizard-orient-server](https://github.com/xvik/dropwizard-orient-server)
* [dropwizard-guicey](https://github.com/xvik/dropwizard-guicey)

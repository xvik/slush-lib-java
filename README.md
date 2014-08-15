#Java library slush generator

[![License](http://img.shields.io/badge/license-MIT-blue.svg?style=flat)](http://www.opensource.org/licenses/MIT)
[![NPM version](http://img.shields.io/npm/v/slush-lib-java.svg?style=flat)](http://badge.fury.io/js/slush-lib-java)

### About

The main goal is to simplify new [github](https://github.com) java library setup. 

Features:
* [MIT](http://opensource.org/licenses/MIT) license (hardcoded)
* [Gradle](http://www.gradle.org/) build
* [Maven central](http://search.maven.org/) compatible artifacts (jar, sources, javadocs)
* Ready for [spock](https://code.google.com/p/spock/) tests
* [Bintray](https://bintray.com/) publication (may be published to maven central using bintray ui)
* [Travis-ci](https://travis-ci.org/) integration (CI and healthy badge)
* [Coveralls](http://coveralls.io/) integration (code coverage badge)
* Code quality checks (pmd, checkstyle)

### Setup

Install [slush](http://slushjs.github.io/):

```bash
$ npm install -g slush
```

Install `slush-lib-java` globally:

```bash
$ npm install -g slush-lib-java
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

### Generator defaults

Some generator questions most likely will not change between your libraries (author, email, github user, bintray repo).
You can specify defaults in `~/.generator` file.

Example:
```
[user]
	libPackage = my.default.package
	authorName = My Name
	authorEmail = my@email.com
	userName = githubNick
	libRepo = bintrayRepoName
```

### Project usage

```bash
$ gradlew check
```

Runs code quality plugins

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

Releases library.

NOTE: During first release bintray upload will fail.. it's a [known issue](https://github.com/bintray/gradle-bintray-plugin/issues/30) - 
this time bintray package was created.. simply release one more time and everything will be ok.

You can simulate release by enabling dryRun in `build.gradle`:

```groovy
dryRun = true
```

In this case library will not be uploaded to bintray.
Use it to check release process and to check generated artifacts before actual release (especially check pom)


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

NOTE: [findbugs](http://www.gradle.org/docs/current/userguide/findbugs_plugin.html) plugin is commented in `quality.gradle` 
because of strage errors (maybe it will work in your case, try to enable it).

By default checkstyle configured with [sun conventions](http://java.sun.com/docs/codeconv/) file 
(see `gradle/config/checkstyle/sun_checks.xml`).
Modify it according to your needs.

Travis is linux based build tool and so will use `gradlew` shell script.
You need to set executable flag on it.

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

To add bintray version badge to github readme: release project, go to bintray package page, get badge link code and insert to readme file.

### Release process

Update `CHANGELOG.md`.

Push all changes before release and wait for `travis` to check build (wait for green badge).

If code quality enabled, do periodically:

```bash
$ gradlew check
```

To fix problems as they appear and not everything before release.

If you releasing first time, try to release with `dryRun` enabled (to simulate release process and make sure everything is alright).
Don't forget to check generated artifacts and pom.

If you're using java 8, you may have problems with javadoc generation, because parser is more restrictive.

Perform release:

```bash
$ gradlew release
```

Tag files with released version number (on github tag will appear as release). 

Increase library version number.

### Examples

These libraries wasn't generated with generator, but original build was created for them, 
so overall projects demonstrate expected target for generated project.

* [guice-persist-orient](https://github.com/xvik/guice-persist-orient)
* [guice-ext-annotations](https://github.com/xvik/guice-ext-annotations)
* [guice-validator](https://github.com/xvik/guice-validator)
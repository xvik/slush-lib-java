#<%= libName %>
[![License](http://img.shields.io/badge/license-MIT-blue.svg?style=flat)](http://www.opensource.org/licenses/MIT)
[![Build Status](http://img.shields.io/travis/<%= userName %>/<%= libName %>.svg?style=flat&branch=master)](https://travis-ci.org/<%= userName %>/<%= libName %>)
[![Coverage Status](https://img.shields.io/coveralls/<%= userName %>/<%= libName %>.svg?style=flat)](https://coveralls.io/r/<%= userName %>/<%= libName %>?branch=master)

### About

<%= libDescription %>

Features:
* Feature 1
* Feature 2

### Setup

Releases are published to [bintray jcenter](https://bintray.com/bintray/jcenter) (package appear immediately after release) 
and then to maven central (require few days after release to be published). 

<!---
[![Download](https://api.bintray.com/packages/<%= bintrayUser %>/<%= libRepo %>/<%= libName %>/images/download.svg) ](https://bintray.com/<%= bintrayUser %>/<%= libRepo %>/<%= libName %>/_latestVersion)
[![Maven Central](https://maven-badges.herokuapp.com/maven-central/<%= libGroup %>/<%= libName %>/badge.svg?style=flat)](https://maven-badges.herokuapp.com/maven-central/<%= libGroup %>/<%= libName %>)
-->

Maven:

```xml
<dependency>
  <groupId><%= libGroup %></groupId>
  <artifactId><%= libName %></artifactId>
  <version><%= libVersion %></version>
</dependency>
```

Gradle:

```groovy
compile '<%= libGroup %>:<%= libName %>:<%= libVersion %>'
```

### Usage

-
[![Slush java lib generator](http://img.shields.io/badge/Powered%20by-Slush%20java%20lib%20generator-orange.svg?style=flat-square)](https://github.com/xvik/slush-lib-java)
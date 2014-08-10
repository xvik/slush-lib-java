#<%= libName %>
[![License](http://img.shields.io/badge/license-MIT-blue.svg?style=flat)](http://www.opensource.org/licenses/MIT)
[![Build Status](http://img.shields.io/travis/<%= userName %>/<%= libName %>.svg?style=flat&branch=master)](https://travis-ci.org/<%= userName %>/<%= libName %>)
[![Coverage Status](https://img.shields.io/coveralls/<%= userName %>/<%= libName %>.svg?style=flat)](https://coveralls.io/r/<%= userName %>/<%= libName %>?branch=master)

### About

<%= libDescription %>

Features:
* One
* [Two link](http://somewhere.com)

### Setup

Releases are published to [bintray jcenter](https://bintray.com/bintray/jcenter) (package appear immediately after release) 
and then to maven central (require few days after release to be published). 

Maven:

```xml
<dependency>
<groupId><%= libPackage %></groupId>
<artifactId><%= libName %></artifactId>
<version><%= libVersion %></version>
</dependency>
```

Gradle:

```groovy
compile '<%= libPackage %>:<%= libName %>:<%= libVersion %>'
```

### Usage
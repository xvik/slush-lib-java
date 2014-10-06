'use strict';

var gulp = require('gulp'),
    gutil = require('gulp-util'),
    conflict = require('gulp-conflict'),
    template = require('gulp-template'),
    rename = require('gulp-rename'),
    through = require('through2'),
    _ = require('underscore.string'),
    inquirer = require('inquirer');

var defaults = (function () {
    var homeDir = process.env.HOME || process.env.USERPROFILE || process.env.HOMEPATH,
        workingDirName = process.cwd().split('/').pop().split('\\').pop(),
        osUserName = homeDir && homeDir.split('/').pop().split('\\').pop() || 'root',
        configFile = homeDir + '/.generator',
        global = {};

    if (require('fs').existsSync(configFile)) {
        global = require('iniparser').parseSync(configFile);
    } else {
        gutil.log('Global configuration file not found: ' + configFile);
    }
    // most defaults taken from ~/.generator
    return {
        libName: workingDirName,
        libGroup: global.libGroup,
        authorName: global.authorName || osUserName,
        authorEmail: global.authorEmail || '',
        userName: global.userName || osUserName,
        libPackage: global.libPackage || '',
        bintrayUser: global.bintrayUser || '',
        libRepo: global.libRepo || global.userName || osUserName,
        bintraySignFiles: global.bintraySignFiles ? 'yes' === global.bintraySignFiles : true,
        enableQualityChecks: global.enableQualityChecks ? 'yes' === global.enableQualityChecks : true
    };
})();

gulp.task('default', function (done) {
    var prompts = [
        {
            name: 'libName',
            message: 'Library name',
            default: defaults.libName
        },
        {
            name: 'libGroup',
            message: 'Library group (maven artifact group)',
            default: defaults.libGroup
        },
        {
            name: 'libPackage',
            message: 'Base package',
            default: defaults.libPackage
        },
        {
            name: 'libDescription',
            message: 'Description'
        },
        {
            name: 'libVersion',
            message: 'Version',
            default: '0.1.0'
        },
        {
            name: 'libTags',
            message: 'Tags for bintray package (comma separated list)',
            default: ''
        },
        {
            name: 'authorName',
            message: 'Author name (full name)',
            default: defaults.authorName
        },
        {
            name: 'authorEmail',
            message: 'Author email',
            default: defaults.authorEmail
        },
        {
            name: 'userName',
            message: 'Github username',
            default: defaults.userName
        },
        {
            name: 'bintrayUser',
            message: 'Bintray user name (used for badge generation only)',
            default: defaults.bintrayUser
        },
        {
            name: 'libRepo',
            message: 'Bintray repository name',
            default: defaults.libRepo
        },
        {
            type: 'confirm',
            name: 'bintraySignFiles',
            message: 'Should bintray sign files on release (bintray must be configured accordingly)?',
            default: defaults.bintraySignFiles
        },
        {
            type: 'confirm',
            name: 'enableQualityChecks',
            message: 'Enable code quality checks (pmd, checkstyle, findbugs)?',
            default: defaults.enableQualityChecks
        },
        {
            type: 'confirm',
            name: 'moveon',
            message: 'Continue?'
        }
    ];
    //Ask
    inquirer.prompt(prompts,
        function (answers) {
            if (!answers.moveon) {
                return done();
            }
            answers.libName = _.slugify(answers.libName);
            answers.libTags = answers.libTags ? answers.libTags.split(',') : [];

            var d = new Date();
            var month = d.getMonth() + 1;
            answers.year = d.getFullYear();
            answers.date = d.getDate() + '.' + (month < 10 ? '0' + month : month) + '.' + d.getFullYear();
            answers.reverseDate = d.getFullYear() + '-' + (month < 10 ? '0' + month : month) + '-'
                + (d.getDate() < 10 ? '0' + d.getDate() : d.getDate());

            // check existence and avoid copying some files which will not change for sure
            var exclude = buildExcludeConfig('stub-gradle');


            // init gradle wrapper and stateless configs
            gulp.src([__dirname + '/stub-gradle/**'].concat(exclude))
                .pipe(debug('stub-gradle'))
                .pipe(conflict('./'))
                .pipe(gulp.dest('./'))
                .on('end', processTemplates);

            exclude = buildExcludeConfig('templates');
            var installSources = !require('fs').existsSync('./src/main/java/');
            if (!installSources) {
                log('Generated sources found, avoid source packages generation');
            }
            exclude.push('!' +__dirname + (installSources ? '/templates/src/**/package/*' : '/templates/src/**'));

            // create project files
            function processTemplates() {
                gulp.src([__dirname + '/templates/**'].concat(exclude))
                    .pipe(debug('template'))
                    .pipe(template(answers))
                    .pipe(rename(function (file) {
                        if (file.basename[0] === '_') {
                            file.basename = '.' + file.basename.slice(1);
                        }
                    }))
                    .pipe(conflict('./'))
                    .pipe(gulp.dest('./'))
                    .on('end', installSources ? initSources : done);
            }

            // create packages
            function initSources() {
                var packageFolder = answers.libPackage.replace(/\./g, '/');

                function createPackage(folder, cb) {
                    var srcDir = __dirname + '/templates/' + folder + '/package/**';
                    var targetDir = './' + folder + '/' + packageFolder + '/';
                    // remove empty folder
                    require('fs').rmdirSync('./' + folder + '/package');
                    gulp.src(srcDir)
                        .pipe(debug('package'))
                        .pipe(template(answers))
                        .pipe(rename(function (file) {
                            if (file.basename[0] === '_') {
                                file.basename = '.' + file.basename.slice(1);
                            }
                        }))
                        .pipe(conflict('./'))
                        .pipe(gulp.dest(targetDir))
                        .on('end', function () {
                            cb();
                        });
                }

                var paths = ['src/main/java',
                    'src/main/resources',
                    'src/test/groovy',
                    'src/test/resources',
                    'src/test/java'];

                var i = 0;

                function nextPath() {
                    if (i < paths.length) {
                        createPackage(paths[i++], nextPath);
                    } else {
                        done();
                    }
                }

                createPackage(paths[i++], nextPath);
            }
        });

    // --verbose argument enables debug logs
    var isDebugEnabled = require('minimist')(process.argv, { boolean: true }).verbose;

    function log() {
        var logger = gutil.log.bind(gutil, '[' + gutil.colors.grey('generator') + ']');
        logger.apply(logger, arguments);
    }

    function debug(name) {
        return through.obj(function (file, enc, cb) {
            if (isDebugEnabled) log('Processing ' + name + ': ' + file.path.replace(__dirname, ''));
            this.push(file);
            cb();
        });
    }

    function buildExcludeConfig(folder) {
        var fs = require('fs');
        var exclusion = [];

        [
            'gradlew',
            'gradlew.bat',
            '.gitignore',
            '.travis.yml',
            'CHANGELOG.md',
            'README.md',
            'gradle.properties',
            'LICENSE',
            'settings.gradle',
            'gradle/config/findbugs/exclude.xml'
        ].forEach(function (path) {
                if (fs.existsSync('./' + path)) {
                    exclusion.push('!' + __dirname + '/'+folder+"/" + path)
                }
            });

        return exclusion;
    }
});
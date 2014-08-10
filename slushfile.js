'use strict';

var gulp = require('gulp'),
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
        user = {};

    if (require('fs').existsSync(configFile)) {
        user = require('iniparser').parseSync(configFile).user;
    } else {
        console.log('global configuration file not found: ' + configFile);
    }
    // most defaults taken from ~/.generator
    return {
        libName: workingDirName,
        authorName: user.authorName || osUserName,
        authorEmail: user.authorEmail || '',
        userName: user.userName || osUserName,
        libPackage: user.libPackage || '',
        libRepo: user.libRepo || user.userName || osUserName
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
            message: 'Tags for bintray package',
            default: ''
        },
        {
            name: 'authorName',
            message: 'Author name',
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
            name: 'libRepo',
            message: 'Bintray repository name?',
            default: defaults.libRepo
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
            answers.year = d.getFullYear();
            answers.date = d.getDate() + '.' + (d.getMonth() <10 ? '0'+d.getMonth(): d.getMonth()) + '.' + d.getFullYear();

            var debug = function (name) {
                return through.obj(function (file, enc, cb) {
                    console.log('processing ' + name + ': ' + file.path);
                    this.push(file);
                    cb();
                });
            };

            function processTemplates() {
                gulp.src(__dirname + '/templates/**')
                    // debug log
//                        .pipe(debug('template'))
                    .pipe(template(answers))
                    .pipe(rename(function (file) {
                        if (file.basename[0] === '_') {
                            file.basename = '.' + file.basename.slice(1);
                        }
                    }))
                    .pipe(conflict('./'))
                    .pipe(gulp.dest('./'))
                    .on('end', function () {
                        done();
                    });
            }

            gulp.src(__dirname + '/stub/**')
                // debug log
//                .pipe(debug('stub'))
                .pipe(conflict('./'))
                .pipe(gulp.dest('./'))
                .on('end', processTemplates);
        });
});
/**
 * Created by bilizhang on 2016/12/13.
 */

var path = require('path');
var gulp = require('gulp');
var sass = require('gulp-sass');
var watch = require('gulp-watch');
var uglify = require('gulp-uglify');
var uglifycss = require('gulp-uglifycss');


// 指定要编译的目录
var watchFilesPath = ['./web/static/sass/*.{scss,sass}'];

// 监听 sass 文件变化,触发 sass 编译&压缩任务
gulp.task('sass-watch', function () {

    gulp.watch(watchFilesPath, ['sass-min']);

});

// sass 编译&压缩任务
gulp.task('sass-min', function () {

    gulp.src(watchFilesPath)
        .pipe(sass())
        .pipe(uglifycss({
            "maxLineLen": 200,
            "uglyComments": true
        }))
        .pipe(gulp.dest(function (file) {
            return './web/static/css';
        }));

});

gulp.task('default', ['sass-min']);





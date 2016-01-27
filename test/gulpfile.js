'use strict';

var gulp = require('gulp');
var sass = require('gulp-sass');

gulp.task('sass-wdj', function () {
    gulp.src('./sass/**/*.scss')
        .pipe(sass().on('error', sass.logError))
        .pipe(gulp.dest('./css'));
});

gulp.task('sass-wdj:watch', function () {
    gulp.watch('./sass/**/*.scss', ['sass-wdj']);
});
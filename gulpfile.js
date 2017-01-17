/* eslint-env node */
"use strict";

const gulp = require('gulp');
const gutil = require("gulp-util");
const sourcemaps = require('gulp-sourcemaps');
const debug = require('gulp-debug');
const gulpIf = require('gulp-if');
const del = require('del');
const webpack = require('webpack');
const jshint = require('gulp-jshint');

const isDevelopment = !process.env.NODE_ENV || process.env.NODE_ENV === 'development';
if (!isDevelopment) {
  console.log('Gulp: executing a production build!');
}

gulp.task('static', function () {
  return gulp.src('src/*.{css,html,png,json}', {buffer: false, since: gulp.lastRun('static')}).pipe(debug())
      .pipe(gulp.dest('webapp')).pipe(debug());
});

gulp.task('webpack', function (callback) {
  webpack(require('./webpack.config'), function (err, stats) {
    if (err) {
      throw new gutil.PluginError("webpack", err);
    }
    gutil.log("[webpack]", stats.toString({
      // output options
    }));
    callback();
  });
});

gulp.task('clean', function () {
  return del('webapp');
});

gulp.task('build', gulp.series(
    'clean',
    gulp.parallel('static', 'webpack')
));

gulp.task('watch', function (callback) {
  if (!isDevelopment) {
    callback();
  }
  return gulp.watch('src/*.{css,html,png,json}', gulp.series('static'));  // webpack
});

gulp.task('default', gulp.series('build', 'watch'));

gulp.task('jshint', function () {
  return gulp.src('src/*.js')
      .pipe(jshint())
      .pipe(jshint.reporter('jshint-stylish'));
  // .pipe(jshint.reporter('fail'));
});

gulp.task('js', function () {  // TODO: write webpack analogue in gulp
  return gulp.src('src/*.js')
      .pipe(gulpIf(isDevelopment, sourcemaps.init()))
      .pipe(gulpIf(isDevelopment, sourcemaps.write()))
      .pipe(gulp.dest('webapp'));
});
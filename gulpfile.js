const gulp = require('gulp');
const gutil = require("gulp-util");
const sourcemaps = require('gulp-sourcemaps');
const debug = require('gulp-debug');
const gulpIf = require('gulp-if');
const del = require('del');
const webpack = require('webpack');

const isDevelopment = !process.env.NODE_ENV || process.env.NODE_ENV == 'development';

gulp.task('static', function () {
    return gulp.src('src/*.{css,html,png,json}', {buffer: false}).pipe(debug())
        .pipe(gulp.dest('webapp')).pipe(debug())
});

gulp.task('webpack', function (callback) {
    webpack(require('./webpack.config'), function (err, stats) {
        if (err) throw new gutil.PluginError("webpack", err);
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
    if(!isDevelopment) callback();
    return gulp.watch('src/*.{css,html,png,json}', gulp.series('static'));  // webpack
});

gulp.task('default', gulp.series('build', 'watch'));

gulp.task('js', function () {  // TODO: write webpack analogue in gulp
    return gulp.src('*.js')
        .pipe(gulpIf(isDevelopment, sourcemaps.init()))
        .pipe(gulpIf(isDevelopment, sourcemaps.write()))
        .pipe(gulp.dest('webapp'));
});
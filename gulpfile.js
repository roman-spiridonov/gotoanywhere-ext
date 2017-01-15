const gulp = require('gulp');
const sourcemaps = require('gulp-sourcemaps');
const debug = require('gulp-debug');
const gulpIf = require('gulp-if');
const del = require('del');


const isDevelopment = !process.env.NODE_ENV || process.env.NODE_ENV == 'development';

gulp.task('res', function () {

});

gulp.task('js', function () {
    gulp.src('*.js')
        .pipe(gulpIf(isDevelopment, sourcemaps.init()))
        .pipe(gulpIf(isDevelopment, sourcemaps.write()))
        .pipe(gulp.dest('public'));
});

/**
 * Adds CDN links to HTML instead of local file links
 */
gulp.task('cdn', function () {

});

gulp.task('build', gulp.series(
    'clean',
    gulp.parallel('static', 'js')
));

gulp.task('clean', function () {
    return del('www');
});


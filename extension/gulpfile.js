var gulp = require('gulp'),
    sass = require('gulp-ruby-sass'),
    csscomb = require('gulp-csscomb'),
    uglify = require('gulp-uglify'),
    rename = require('gulp-rename'),
    notify = require('gulp-notify'),
    livereload = require('gulp-livereload'),
    del = require('del');

// Scsscomb
gulp.task('scsscomb', function() {
    return gulp.src('src/css/*.scss')
        .pipe(csscomb())
        .pipe(gulp.dest('src/css'))
        .pipe(notify({
            message: 'Scsscomb task complete'
        }));
});

// Styles
gulp.task('styles', function() {
    return sass('src/css/*.scss', {
            style: 'compressed'
        })
        .pipe(rename({
            suffix: '.min'
        }))
        .pipe(gulp.dest('dist/css'))
        .pipe(notify({
            message: 'Styles task complete'
        }));
});

// Scripts
gulp.task('scripts', function() {
    return gulp.src('src/js/*.js')
        .pipe(rename({
            suffix: '.min'
        }))
        .pipe(uglify())
        .pipe(gulp.dest('dist/js'))
        .pipe(notify({
            message: 'Scripts task complete'
        }));
});

// Clean
gulp.task('clean', function() {
    return del(['dist/css', 'dist/js']);
});

// Default task
gulp.task('default', ['clean', 'scsscomb'], function() {
    gulp.start('styles', 'scripts');
});

// Watch
gulp.task('watch', function() {
    gulp.watch('src/css/*.scss', ['styles']);
    gulp.watch('src/js/*.js', ['scripts']);
    livereload.listen();
    gulp.watch(['public/stylesheets/css/*.css']).on('change', livereload.changed);
});

const gulp = require('gulp');
const cleanCSS = require('gulp-clean-css');
const concat = require('gulp-concat');
const gulpSass = require('gulp-sass');
gulpSass.compiler = require('node-sass');
const autoprefixer = require('gulp-autoprefixer');
const babel = require('gulp-babel');
const terser = require('gulp-terser');
const del = require('del');
const browserSync = require('browser-sync').create();
const sourcemaps = require('gulp-sourcemaps');

function sass() {
    return gulp.src('./src/styles/*.scss')
        .pipe(gulpSass().on('error', gulpSass.logError))
        .pipe(autoprefixer({
            "overrideBrowserslist": [
                "defaults"
            ],
            cascade: false
        }))
        .pipe(cleanCSS({level: 2}))
        .pipe(gulp.dest('./build/styles'))
        .pipe(browserSync.stream());
}

function watch() {
    browserSync.init({
    server: {
        baseDir: "./"
    },
});
    gulp.watch('./src/styles/*.scss', sass);
    gulp.watch('./src/**/*.js', scripts);
    gulp.watch('./*.html', browserSync.reload);
}

function scripts() {
    return gulp.src('./src/js/*.js')
        .pipe(sourcemaps.init())
        .pipe(babel({
            presets: ['@babel/env']
        }))
        .pipe(terser())
        .pipe(concat('script.js'))
        .pipe(sourcemaps.write())
        .pipe(gulp.dest('./build/js'))
        .pipe(browserSync.stream());

}

function clean () {
    return del(['build/*'])
}

gulp.task('scripts', scripts);
gulp.task('sass', sass);
gulp.task('watch', watch);
gulp.task('clean', clean);
gulp.task('build', gulp.series(scripts, sass));
gulp.task('dev', gulp.series('build', 'watch'));

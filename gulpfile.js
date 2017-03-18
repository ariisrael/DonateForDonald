const gulp = require('gulp');
const concat = require('gulp-concat');
const uglify = require('gulp-uglify');
const babel = require('gulp-babel');
const sass = require('gulp-sass');
const del = require('del')

gulp.task('clean', () => {
  return del(['public']);
});

gulp.task('scripts', ['clean'], () =>
    gulp.src([
      'client/js/*.js',
      'client/js/*.jsx',
      'client/js/**/*.js',
      'client/js/**/*.jsx'
    ])
        .pipe(babel({
            presets: ['es2015', 'react']
        }))
        .pipe(concat('app.js'))
        .pipe(gulp.dest('public/js'))
)

gulp.task('vendorScripts', ['clean'], () =>
    gulp.src([
      'client/vendor/js/jquery.js',
      'client/vendor/js/bootstrap.js',
    ])
        .pipe(babel({
            presets: ['es2015', 'react']
        }))
        .pipe(concat('vendor.js'))
        .pipe(gulp.dest('public/js'))
)


gulp.task('styles', ['clean'], () => {
  return gulp.src(['./client/css/*.css', './client/css/**/*.css', './client/css/*.scss'])
    .pipe(sass().on('error', sass.logError))
    .pipe(concat('app.css'))
    .pipe(gulp.dest('./public/css'));
})

gulp.task('vendorStyles', ['clean'], () => {
  return gulp.src(['./client/vendor/css/*.css', './client/vendor/css/**/*.css', './client/vendor/css/*.scss'])
    .pipe(sass().on('error', sass.logError))
    .pipe(concat('vendor.css'))
    .pipe(gulp.dest('./public/css'));
})


gulp.task('images', ['clean'], () => {
  return gulp.src(['client/images/*'])
  .pipe(gulp.dest('./public/images'))
})

gulp.task('favicon', ['clean'], () => {
  return gulp.src(['client/favicon.ico'])
  .pipe(gulp.dest('./public'))
})

gulp.task('build', ['clean', 'scripts', 'vendorStyles', 'vendorScripts', 'styles', 'favicon', 'images'])

gulp.task('watch', () => {
  gulp.watch('client/*','client/**/*', ['build'])
})

gulp.task('default', ['build'])

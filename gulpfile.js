const gulp = require('gulp');
const concat = require('gulp-concat');
const uglify = require('gulp-uglify');
const babel = require('gulp-babel');
const sass = require('gulp-sass');
const del = require('del')

gulp.task('clean-js', () => {
  return del(['public/js']);
});

gulp.task('scripts', ['clean-js'], () =>
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

gulp.task('vendorScripts', ['clean-js'], () =>
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

gulp.task('clean-css', () => {
  return del(['public/css']);
});

gulp.task('styles', ['clean-css'], () => {
  return gulp.src(['./client/css/*.css', './client/css/**/*.css', './client/css/*.scss'])
    .pipe(sass().on('error', sass.logError))
    .pipe(concat('app.css'))
    .pipe(gulp.dest('./public/css'));
})

gulp.task('vendorStyles', ['clean-css'], () => {
  return gulp.src(['./client/vendor/css/*.css', './client/vendor/css/**/*.css', './client/vendor/css/*.scss'])
    .pipe(sass().on('error', sass.logError))
    .pipe(concat('vendor.css'))
    .pipe(gulp.dest('./public/css'));
})

gulp.task('clean-images', () => {
  return del(['public/images']);
});

gulp.task('images', ['clean-images'], () => {
  return gulp.src(['client/images/*'])
  .pipe(gulp.dest('./public/images'))
})

gulp.task('favicon', () => {
  return gulp.src(['client/favicon.ico'])
  .pipe(gulp.dest('./public'))
})

gulp.task('build', ['scripts', 'vendorStyles', 'vendorScripts', 'styles', 'favicon', 'images'])

gulp.task('watch', () => {
  gulp.watch([
    './client/css/*.css',
    './client/css/**/*.css',
    './client/css/*.scss',
    './client/vendor/css/*.css',
    './client/vendor/css/**/*.css',
    './client/vendor/css/*.scss'
  ], ['vendorStyles', 'styles'])

  gulp.watch([
    'client/js/*.js',
    'client/js/*.jsx',
    'client/js/**/*.js',
    'client/js/**/*.jsx',
    'client/vendor/js/jquery.js',
    'client/vendor/js/bootstrap.js',
  ], ['scripts', 'vendorScripts'])

  gulp.watch([
    ['client/favicon.ico'], ['favicon']
  ])

  gulp.watch(['client/images/*'], ['images'])
})

gulp.task('default', ['build'])

const gulp = require('gulp');
const concat = require('gulp-concat');
const uglify = require('gulp-uglify');
const babel = require('gulp-babel');
const cleanCSS = require('gulp-clean-css')
const sass = require('gulp-sass');
const del = require('del')

gulp.task('clean-js', () => {
  return del(['public/js']);
});

gulp.task('scripts', ['clean-js'], () => {
    var pipe = gulp.src([
      'client/js/*.js',
      'client/js/*.jsx',
      'client/js/**/*.js',
      'client/js/**/*.jsx'
    ])
    .pipe(babel({
        presets: ['es2015', 'react']
    }))
    .pipe(concat('app.js'))

    if (process.env.NODE_ENV === 'production') {
      pipe = pipe.pipe(uglify())
    }

    return pipe.pipe(gulp.dest('public/js'))
})

gulp.task('vendorScripts', ['clean-js'], () => {
    var pipe = gulp.src([
      'client/vendor/js/jquery.js',
      'client/vendor/js/bootstrap.js',
    ])
        .pipe(babel({
            presets: ['es2015', 'react']
        }))
        .pipe(concat('vendor.js'))

        if (process.env.NODE_ENV === 'production') {
          pipe = pipe.pipe(uglify())
        }

        return pipe.pipe(gulp.dest('public/js'))
})

gulp.task('clean-css', () => {
  return del(['public/css']);
});

gulp.task('styles', ['clean-css'], () => {
  var pipe = gulp.src(['./client/css/*.css', './client/css/**/*.css', './client/css/*.scss'])
    .pipe(sass().on('error', sass.logError))
    .pipe(concat('app.css'))

    if (process.env.NODE_ENV === 'production') {
      pipe = pipe.pipe(cleanCSS({
        compatibility: 'ie8'
      }))
    }

    return pipe.pipe(gulp.dest('./public/css'));
})

gulp.task('vendorStyles', ['clean-css'], () => {
  var pipe = gulp.src(['./client/vendor/css/*.css', './client/vendor/css/**/*.css', './client/vendor/css/*.scss'])
    .pipe(sass().on('error', sass.logError))
    .pipe(concat('vendor.css'))

    if (process.env.NODE_ENV === 'production') {
      pipe = pipe.pipe(cleanCSS({
        compatibility: 'ie8'
      }))
    }

    return pipe.pipe(gulp.dest('./public/css'));
})

gulp.task('clean-images', () => {
  return del(['public/images']);
});

gulp.task('images', ['clean-images'], () => {
  return gulp.src(['client/images/*', 'client/images/**/*'])
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

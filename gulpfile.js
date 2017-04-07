var gulp = require('gulp');
var sass = require('gulp-sass');
var autoprefixer = require('gulp-autoprefixer');
var server = require('gulp-webserver');

gulp.task('webserver', function() {
  gulp.src('./')
    .pipe(server({
      livereload: true,
      open: true,
      port: 8080,
    }));
});

gulp.task('sass', function() {
  return gulp.src('sass/*.sass')
          .pipe(sass().on('error', sass.logError))
          .pipe(autoprefixer({
              browsers: ['last 2 versions']
          }))
          .pipe(gulp.dest('css'));
});

gulp.task('watch', function() {
  gulp.watch('sass/*.sass', ['sass']);
});


gulp.task('default', ['sass', 'watch', 'webserver']);

var gulp = require('gulp');
var browserify = require('browserify');
var fs = require('fs');

// gulp.task('public', function(){
//   return gulp.src('public/*')
//     .pipe(gulp.dest('build'))
// });

gulp.task('js', function () {
  // set up the browserify instance on a task basis
  var b = browserify({
    entries: './app/index.js',
    debug: true,
  });

  return b.bundle()
    .pipe(fs.createWriteStream('public/bundle.js'));
});

gulp.task('build', [ 'js' ]);

var gulp = require('gulp'),
  jshint = require('gulp-jshint'),
  uglify = require('gulp-uglify'),
  scsslint = require('gulp-scss-lint'),
  compass = require('gulp-for-compass'),
  zip = require('gulp-zip'),
  gulpSequence  = require('gulp-sequence'),
  mergeStream = require('merge-stream'),
  clean = require('gulp-clean'),
  jsFiles = 'js/**/*',
  scssFiles = 'scss/**/*';

//Lint JavaScript files
gulp.task('lintJs', function () {
  gulp.src([jsFiles + '.js', '!js/lib/**/*.js', '!js/util/sha1.js'])
    .pipe(jshint({
      "sub": true,
      "laxbreak": true,
      "laxcomma": true,
      "regexp": true,
      "asi": false,
      "browser": true,
      "loopfunc": true,
      "expr": true,
      "node": true,
      "es3": true,
      "esnext": true,
      "bitwise": true,
      "curly": true,
      "immed": true,
      "latedef": false,
      "expr": true,
      "eqeqeq": false,
      "eqnull": false,
      "newcap": true,
      "noarg": true,
      "undef": false,
      "proto": true,
      "strict": false,
      "smarttabs": true,
      "plusplus": false,
      "shadow": true
    }))
    .pipe(jshint.reporter('default'));
});

// 合并，压缩文件
// clean 只能删除当前目录下的文件
/*gulp.task('clean', function(){
   gulp.src('../www/!**!/!*', {read: false})
       .pipe(clean());
});*/
// 文件转移到www
gulp.task('files', function () {
  var html = gulp.src('./index.html')
    .pipe(gulp.dest('../www/www/'));

  var plugins = gulp.src('./plugins/**/*')
    .pipe(gulp.dest('../www/www/plugins'));

  var js = gulp.src('./js/**/*')
    .pipe(gulp.dest('../www/www/js'));

  var libs = gulp.src('./libs/**/*')
    .pipe(gulp.dest('../www/www/libs'));
	
  var template = gulp.src('./template/**/*')
    .pipe(gulp.dest('../www/www/template'));

  return mergeStream(html, plugins, js, libs, template);
});

// www.zip
gulp.task('zip', function () {
  return gulp.src('../www/**/*')
    .pipe(zip('www.zip'))
    .pipe(gulp.dest('../'));
});

// deploy
gulp.task('deploy', gulpSequence('files', 'zip'));

// 默认任务
gulp.task('default', function () {
  gulp.run('deploy');
});

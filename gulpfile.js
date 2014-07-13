// gulpfile.js
// wuct @ 2014.7.13

'use strict';

var gulp = require('gulp')
, concat = require('gulp-concat')
, notify = require('gulp-notify')
, livereload = require('gulp-livereload')
, templateCache = require('gulp-angular-templatecache')
, rimraf = require('gulp-rimraf')
, less = require('gulp-less')
;

var distDir = './dist/'
, tempDir = './temp/'
, jsSrc = './src/app/**/*.js'
, jsDest = distDir + 'scripts'
, cssSrc = './src/less/**/*.less'
, cssDest = distDir + 'css'
, tplSrc = './src/app/**/*.html'
;


gulp.task('default', ['clean'], function() {
  return gulp.start('scripts', 'styles', 'htmls');
});

gulp.task('clean', function() {
  return gulp.src([distDir, tempDir], {read: false})
  .pipe(rimraf())
  .pipe(notify({ message: 'Clean task complete' }));
})


// Scripts

gulp.task('scripts', ['scripts:vendor', 'scripts:templates'], function() {
  return gulp.src([jsSrc, tempDir + '/templates.js'])
    .pipe(concat('main.js'))
    .pipe(gulp.dest(jsDest))
    .pipe(notify({ message: 'Scripts task complete' }));
});

gulp.task('scripts:templates', function() {
  return gulp.src(tplSrc)
    .pipe(templateCache('templates.js', {
      module: 'cpTemplates',
      root: '/app/',
      standalone: true
    }))
    .pipe(gulp.dest(tempDir));
});

gulp.task('scripts:vendor', function() {
  return gulp.src([
    // order matter
    // "bower_components/jquery/dist/jquery.js",
    // "bower_components/lodash/dist/lodash.js",
    "bower_components/angular/angular.js",
    // "bower_components/angular-animate/angular-animate.js",
    // "bower_components/angular-sanitize/angular-sanitize.js",
    // "bower_components/angular-resource/angular-resource.js",
    // "bower_components/angular-i18n/angular-locale_zh-tw.js",
    // "bower_components/angular-ui-utils/modules/keypress/keypress.js",
    // "bower_components/danialfarid-angular-file-upload/dist/angular-file-upload.js",
    // "bower_components/showdown/compressed/showdown.js",
    // "bower_components/angular-markdown-directive/markdown.js",
    // "bower_components/ngstorage/ngStorage.js",
    // "bower_components/ngInfiniteScroll/build/ng-infinite-scroll.js",
    // "bower_components/angular-ui-router/release/angular-ui-router.js",
    // "bower_components/uservoice-trigger-directive/uservoice-trigger-directive.js",
    // "src/vendor/smartbanner.js",
    // "src/vendor/bootstrap.min.js",
    // "src/vendor/async.js",
    // "src/vendor/socket.js",
    // "src/vendor/ui-bootstrap-tpls-0.6.0.js",
    // "src/vendor/angular-google-maps.js",
  ])
  .pipe(concat('vendor.js'))
  .pipe(gulp.dest(jsDest));
});


// Styles
gulp.task('styles', function() {
  return gulp.src('./src/less/app.less')
    .pipe(less({
      paths  : [
        "bower_components/bootstrap/less/",
      ]
    }))
    .pipe(gulp.dest(cssDest))
    .pipe(notify({ message: 'Styles task complete' }));
});

// Html
gulp.task('htmls', function() {
  return gulp.src('./src/index.html')
    .pipe(gulp.dest(distDir))
    .pipe(notify({ message: 'Htmls task complete' }));
});

gulp.task('watch', function() {
  gulp.watch(cssSrc, ['styles']);
  gulp.watch(jsSrc, ['scripts']);
  gulp.watch(tplSrc, ['scripts']);
  gulp.watch('./src/index.html', ['htmls']);

  // Watch image files
  // gulp.watch('src/images/**/*', ['images']);

  // Create LiveReload server
  livereload.listen(35729);

  // Watch any files in dist/, reload on change
  gulp.watch([distDir + '**']).on('change', function(file) {
    livereload.changed(file.path);
  });
});

// http://stackoverflow.com/questions/22886682/how-can-gulp-be-restarted-on-gulpfile-change
// var argv = require('yargs').argv // for args parsing
// , spawn = require('child_process').spawn
// ;
// gulp.task('ar', function() {
//   var p;

//   gulp.watch('gulpfile.js', spawnChildren);
//   spawnChildren();

//   function spawnChildren(e) {
//     // kill previous spawned process
//     if(p) { p.kill(); }

//     // `spawn` a child `gulp` process linked to the parent `stdio`
//     p = spawn('gulp', [argv.t], {stdio: 'inherit'});
//   };
// });
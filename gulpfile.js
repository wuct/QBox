// gulpfile.js
// wuct @ 2014.7.13

'use strict';

var gulp = require('gulp')
, concat = require('gulp-concat')
, uglify = require('gulp-uglify')
, gzip = require('gulp-gzip')
, notify = require('gulp-notify')
, livereload = require('gulp-livereload')
, templateCache = require('gulp-angular-templatecache')
, rimraf = require('gulp-rimraf')
, less = require('gulp-less')
, minifyCSS = require('gulp-minify-css')
, s3 = require("gulp-s3")
, awspublish = require('gulp-awspublish');
;

var distDir = './public/'
, tempDir = './temp/'
, jsSrc = './src/app/**/*.js'
, jsDest = distDir + 'scripts'
, cssSrc = './src/less/**/*.less'
, cssDest = distDir + 'css'
, imgDest = distDir + 'images'
, tplSrc = './src/app/**/*.html'
;


gulp.task('default', ['clean'], function() {
  return gulp.start('scripts', 'styles', 'htmls', 'images', 'fonts');
});

gulp.task('clean', function() {
  return gulp.src([distDir, tempDir], {read: false})
  .pipe(rimraf())
  .pipe(notify({ message: 'Clean task complete' }));
});

gulp.task('compress', ['scripts', 'styles'], function () {
  gulp.src(cssDest +'/*.css')
    .pipe(minifyCSS())
    .pipe(gulp.dest(cssDest))
    // .pipe(gzip())
    // .pipe(gulp.dest(cssDest))
    .pipe(notify({ message: 'Compress styles task complete' }));

  gulp.src(jsDest + '/*.js')
    .pipe(uglify({mangle: false}))
    .pipe(gulp.dest(jsDest))
    // .pipe(gzip())
    // .pipe(gulp.dest(jsDest))
    .pipe(notify({ message: 'Compress scripts task complete' }));
});

gulp.task('s3', function() {
  return gulp.src(distDir +'**')
  .pipe(s3({
    "key": process.env.AWS_S3_CDN_KEY,
    "secret": process.env.AWS_S3_CDN_SECRET,
    "bucket": "q-box.co",
    "region": "ap-northeast-1"
  }));
});

gulp.task('publish', ['compress'], function() {
  var publisher = awspublish.create({
    key: process.env.AWS_S3_CDN_KEY,
    secret: process.env.AWS_S3_CDN_SECRET,
    bucket: "q-box.co",
    region: "ap-northeast-1"
  });

  return gulp.src(distDir + '**')
    .pipe(publisher.publish()) // upload unzip files
    .pipe(publisher.sync()) // delete files in the bucket that are not in the local folder
    // .pipe(awspublish.gzip({ ext: '.gz' }))
    // .pipe(publisher.publish()) // upload gzipped files
    .pipe(publisher.cache())
    .pipe(awspublish.reporter());
});

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
      module: 'templates',
      standalone: true
    }))
    .pipe(gulp.dest(tempDir));
});

gulp.task('scripts:vendor', function() {
  return gulp.src([
    // order matter
    "bower_components/angular/angular.js",
    "bower_components/angular-ui-router/release/angular-ui-router.js",
    "bower_components/angular-sanitize/angular-sanitize.js",
    "bower_components/firebase/firebase.js",
    "bower_components/firebase-simple-login/firebase-simple-login.js",
    "bower_components/angularfire/angularfire.js",
    "src/vendor/angularify.semantic.dropdown.js",
  ])
  .pipe(concat('vendor.js'))
  .pipe(gulp.dest(jsDest));
});


// Styles
gulp.task('styles', function() {
  return gulp.src('./src/less/app.less')
    .pipe(less({
      paths  : [
        "./bower_components/fontawesome/less/",
        "./bower_components/semantic/build/less/collections/",
        "./bower_components/semantic/build/less/elements/",
        "./bower_components/semantic/build/less/modules/",
        "./bower_components/semantic/build/less/views/",
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

// Image
gulp.task('images', function() {
  gulp.src('./src/ico/favicon.ico')
  .pipe(gulp.dest(distDir));

  gulp.src('./src/ico/*.png')
  .pipe(gulp.dest(distDir + 'ico/'));

  return gulp.src([
      './bower_components/semantic/build/packaged/images/*.gif',
      './src/images/*.png',
      './src/images/*.jpg',
      ])
    .pipe(gulp.dest(imgDest))
    .pipe(notify({ message: 'Images task complete' }));
});

// Fonts
gulp.task('fonts', function() {
  return gulp.src('./src/fonts/**')
  .pipe(gulp.dest(distDir + 'fonts'))
  .pipe(notify({ message: 'Fonts task complete' }));
});

// Watch
gulp.task('watch', function() {
  gulp.watch(cssSrc, ['styles']);
  gulp.watch([jsSrc, './src/vendor/**.js'], ['scripts']);
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
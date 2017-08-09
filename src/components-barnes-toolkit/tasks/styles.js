// ### Styles
// `gulp styles` - Compiles, combines, and optimizes Bower CSS and project CSS.
// By default this task will only log a warning if a precompiler error is
// raised. If the `--production` flag is set: this task will fail outright.

module.exports = function(gulp, data, util, taskName) {
  'use strict';

  var $           = data.plugins,
      mergeStream = require('merge-stream'),
      lazypipe    = require('lazypipe');

  // Creates plugin sequence for a dependency using lazy pipe
  function createDepLazyPipe(dep) {
      // console.log(data);
    return lazypipe()
      .pipe($.if,data.enabled.maps, $.sourcemaps.init())
      .pipe($.if,'*.scss', $.sass({
                outputStyle: 'nested', // libsass doesn't support expanded yet
                precision: 10,
                includePaths: ['.'],
                errLogToConsole: !data.enabled.failStyleTask
              }))
      .pipe($.concat, dep.name)
      .pipe($.autoprefixer,{
        browsers: [
          'last 2 versions',
          'android 4',
          'opera 12'
        ]
      })
      .pipe($.cleanCss, {
        advanced: false,
        rebase: false
      })
      .pipe($.if, data.enabled.maps, $.sourcemaps.write('.', {
              sourceRoot: data.manifest.paths.source + data.manifest.paths.styles
            }))
      .pipe($.notify, {
        onLast: true,
        title: 'CSS Compiled',
        message: '<%= file.relative %> complete'
      })
      .pipe(gulp.dest, data.manifest.paths.dist + 'styles')
      .pipe(gulp.dest, data.manifest.paths.distCraft + 'styles');
  }


  // Task declaration
  gulp.task(taskName, function() {
    var merged = mergeStream();

    // go through each dependency and add pipe to stream.
    data.manifest.forEachDependency('css', function (dep) {
      // console.log($.if);
      merged.add(gulp.src(dep.globs, {base: 'styles'})
                     .pipe($.if(!data.enabled.failStyleTask, $.plumber({
                              errorHandler: function(err){
                                $.notify.onError({
                                    title:    "SCSS Error",
                                    message:  "Error: <%= error.message %>",
                                    sound:    "Basso"
                                })(err);
                                this.emit('end');
                              }
                            })))
                     .pipe(createDepLazyPipe(dep)())
                     .pipe(data.browserSync.stream({
                        match: '**/*.css'
                     })));
    });

    return merged;
  });
};

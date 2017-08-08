// ### Icons
// `gulp icons` - Creates SVG sprite and put into the /dist/ folder and the
// Craft version of the /dist/ folder too
// https://github.com/jkphl/svg-sprite/blob/master/docs/configuration.md

var svgSprite    = require('gulp-svg-sprite');

module.exports = function(gulp, data, util, taskName){
  'use strict';

  var $    = data.plugins,
      path = data.manifest.paths;

  gulp.task('icons', function() {
    return gulp.src(path.source + path.icons +'*.svg')
     .pipe(
      $.if(!data.enabled.failStyleTask, $.plumber({
        errorHandler: function(err){
          $.notify.onError({
            title:    "Icon Error",
            message:  "Error: <%= error.message %>",
            sound:    "Basso"
          })(err);
          this.emit('end');
        }
      })))
      .pipe(svgSprite({
        shape: {
          id: {
            generator: 'icon--%s'
          }
        },
        mode: {
          symbol: {
            dest: '.',
            prefix: '.%s',
            dimensions: '%s',
            sprite: 'icons.svg',
          }
        }
    }))
    .pipe($.notify({
      onLast: true,
      title: "Icons Compiled",
      message: "All icons compiled"
    }))
    .pipe(gulp.dest(path.dist + path.icons))
    .pipe(gulp.dest(path.distCraft + path.icons));
  });
};

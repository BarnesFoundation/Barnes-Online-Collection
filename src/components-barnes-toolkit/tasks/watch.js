// ### Watch
// `gulp watch` - Use BrowserSync to proxy your dev server and synchronize code
// changes across devices. Specify the hostname of your dev server at
// `manifest.config.devUrl`. When a modification is made to an asset, run the
// build step for that asset and inject the changes into the page.
// See: http://www.browsersync.io

module.exports = function(gulp, data, util, taskName){
  'use strict';

  var config = data.manifest.config,
      path = data.manifest.paths;

  gulp.task('watch', function() {
    data.browserSync.init({
      files: ['**/*.php', '**/*.html', '**/*.twig'],
      proxy: config.devUrl,
      notify: false,
      snippetOptions: {
        whitelist: config.whitelist,
        blacklist: config.blacklist
      }
    });
    gulp.watch([path.source + path.styles +'**/*', path.source + path.components +'**/*.scss'], ['styles']);
    gulp.watch([path.source + path.scripts +'**/*', path.source + path.components +'**/*.js'], ['scripts']);
    gulp.watch([path.source + path.components +'**/*.twig'], ['templates']);
    gulp.watch([path.source + 'fonts/**/*'], ['fonts']);
    gulp.watch([path.source + path.icons +'**/*'], ['icons']);
    gulp.watch([path.source + 'images/**/*'], ['images']);
    gulp.watch([path.source + 'manifest.json'], ['build']);
  });
};

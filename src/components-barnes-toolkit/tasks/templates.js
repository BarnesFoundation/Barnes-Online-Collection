// ### Templates
// Take our .hbs files and create .html files that anyone can use
// 1 Loop through all twig files
// 2 Convert from twig to HTML and rename from file.twig to file.html
// 3 Remove line-breaks
// 4 Prettify resulting HTML so it is readable in our toolkit
// 5 Put new HTML files in same directory as twig files

module.exports = function(gulp, data, util, taskName) {

  'use strict';

  var twig = require('gulp-twig');
  var rename = require('gulp-rename');
  var prettify = require('gulp-html-prettify');
  var replace = require('gulp-replace');

  gulp.task('templates', function(){

    var functions = [
      {
          name: "random",
          func: function (max) {
            var min = 0;
            var max = Math.floor(max);
            return Math.floor(Math.random() * (max - min)) + min;
          }
      }
    ];

    //console.log(data.manifest.paths.source);

    var components = gulp.src(data.manifest.paths.source + data.manifest.paths.components + '**/*.twig')
      .pipe(twig({ functions: functions }))
      .pipe(rename({ extname: '.html' }))
      .pipe(replace(/\n\s*\n/g, ''))
      .pipe(prettify({indent_char: ' ', indent_size: 2}))
      .pipe(gulp.dest(data.manifest.paths.source + data.manifest.paths.components));

    var scss = gulp.src(data.manifest.paths.source + data.manifest.paths.styles + '**/*.twig')
      .pipe(twig({ functions: functions }))
      .pipe(rename({ extname: '.html' }))
      .pipe(replace(/\n\s*\n/g, ''))
      .pipe(prettify({indent_char: ' ', indent_size: 2}))
      .pipe(gulp.dest(data.manifest.paths.source + data.manifest.paths.styles));

      return {};
  });

};

// ### newComponent
// Allow a developer to create a new front-end component
// with a gulp task
// $ gulp newComponent --name-of-component
// will create the new directory and the required files inside it e.g.
// _name-of-component.scss, _name-of-component.js and _name-of-component.twig

module.exports = function(gulp, data, util, taskName) {

  'use strict';

  var rename = require('gulp-rename');
  var replace = require('gulp-replace');

  gulp.task('newComponent', function(){

    var newName = process.argv[3].replace('--', ''); //set to '123'

    if (!process.argv[3]) {
      console.log('Please enter a component name');
      return;
    } else if (process.argv[3].indexOf('--') < 0) {
      console.log('Please use the format --component-name');
      return;
    }

    console.log(newName);

    return gulp.src(data.manifest.paths.source + data.manifest.paths.components + 'example/*')
      .pipe(rename({'basename': '_' + newName }))
      .pipe(replace('example', newName))
      .pipe(replace('Example', newName))
      .pipe(gulp.dest(data.manifest.paths.source + data.manifest.paths.components + newName));
  });

};

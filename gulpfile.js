'use strict';

const { src, dest, series } = require('gulp');
const zip = require('gulp-zip');

function build() {
    return src(['package.json', '.npmrc', 'build/**', 'server/**', 'scripts/**', 'src/artObjectTitles.json', 'src/ensembleIndexes.js', 'cron.yaml'], {base: './'})
    .pipe(dest('dist'));
}

function zipDist() {
    return src('./dist/**', { dot: true })
        .pipe(zip('dist.zip'))
        .pipe(dest('./'));
}

exports.default = series(
    build,
    zipDist
)
const gulp = require('gulp')
const nearUtils = require('near-sdk-as/compiler')

function buildWasm (done) {
  nearUtils.compile('./assembly/main.ts', './out/main.wasm', done)
};

const build = gulp.series(buildWasm)

exports.default = build

'use strict';

var firstTime = true;

module.exports = function (fatalError, stats) {
  if (fatalError) {
    console.error(fatalError);
    return;
  }

  var jsonStats = stats.toJson('verbose');
  var buildError = fatalError || jsonStats.errors[0] || jsonStats.warnings[0];

  if (buildError) {
    console.log(buildError);
  } else {
    console.log(stats.toString({
      assets: true,
      chunks: true,
      colors: true,
      hash: false,
      providedExports: true,
      timings: true,
      usedExports: true,
      version: false
    }));
  }

  if (firstTime) {
    console.log('\ncool, now:');
    console.log('run web --prod');
  }
};
//# sourceMappingURL=build.log.js.map
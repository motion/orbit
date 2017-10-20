'use strict';

var path = require('path');
var fs = require('fs');
var url = require('url');

var dir = process.env.BUILD_DIR || process.cwd();
var appDirectory = fs.realpathSync(dir);

function resolveApp(relativePath) {
  return path.resolve(appDirectory, relativePath);
}

var nodePaths = (process.env.NODE_PATH || '').split(process.platform === 'win32' ? ';' : ':').filter(Boolean).filter(function (folder) {
  return !path.isAbsolute(folder);
}).map(resolveApp);

var envPublicUrl = process.env.APP_URL;

function ensureSlash(path, needsSlash) {
  var hasSlash = path.endsWith('/');
  if (hasSlash && !needsSlash) {
    return path.substr(path, path.length - 1);
  } else if (!hasSlash && needsSlash) {
    return path + '/';
  } else {
    return path;
  }
}

function getPublicUrl(appPackageJson) {
  return envPublicUrl || require(appPackageJson).homepage;
}

function getServedPath(appPackageJson) {
  var publicUrl = getPublicUrl(appPackageJson);
  var servedUrl = envPublicUrl || (publicUrl ? url.parse(publicUrl).pathname : '/');
  return ensureSlash(servedUrl, true);
}

module.exports = {
  appBuild: resolveApp('build'),
  appPublic: resolveApp('public'),
  appHtml: resolveApp('index.html'),
  appIndexJs: resolveApp('./src'),
  appPackageJson: resolveApp('package.json'),
  appNodeModules: resolveApp('node_modules'),
  modelsNodeModules: resolveApp('../models/node_modules'),
  nodePaths: nodePaths,
  publicUrl: getPublicUrl(resolveApp('package.json')),
  servedPath: getServedPath(resolveApp('package.json'))
};
//# sourceMappingURL=paths.js.map
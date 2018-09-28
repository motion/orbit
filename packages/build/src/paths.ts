import path from 'path'
import fs from 'fs'
import url from 'url'

const ROOT_DIR = process.env.BUILD_DIR || process.cwd()
var appDirectory = fs.realpathSync(ROOT_DIR)

function resolveApp(relativePath) {
  return path.resolve(appDirectory, relativePath)
}

var nodePaths = (process.env.NODE_PATH || '')
  .split(process.platform === 'win32' ? ';' : ':')
  .filter(Boolean)
  .filter(folder => !path.isAbsolute(folder))
  .map(resolveApp)

var envPublicUrl = process.env.APP_URL

function ensureSlash(path, needsSlash) {
  var hasSlash = path.endsWith('/')
  if (hasSlash && !needsSlash) {
    return path.substr(path, path.length - 1)
  } else if (!hasSlash && needsSlash) {
    return path + '/'
  } else {
    return path
  }
}

function getPublicUrl(appPackageJson) {
  return envPublicUrl || require(appPackageJson).homepage
}

function getServedPath(appPackageJson) {
  var publicUrl = getPublicUrl(appPackageJson)
  var servedUrl = envPublicUrl || (publicUrl ? url.parse(publicUrl).pathname : '/')
  return ensureSlash(servedUrl, true)
}

export default {
  resolve: resolveApp,
  appBuild: resolveApp('build'),
  appPublic: resolveApp('public'),
  appHtml: resolveApp('index.html'),
  appEntry: resolveApp(process.env.ENTRY || './src/index.js'),
  appPackageJson: resolveApp('package.json'),
  nodePaths: nodePaths,
  publicUrl: getPublicUrl(resolveApp('package.json')),
  servedPath: getServedPath(resolveApp('package.json')),
}

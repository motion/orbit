const Path = require('path')

const EXTENSIONS = {
  remoteDevtools: 'devtools-remote',
  mobx: 'fmkadmapgofadopljbjfkapdkoienihi',
  react: 'pfgnfdagidkfgccljigdamigbcnndkod',
}

const extensionToID = name => EXTENSIONS[name]
const extensionIDToPath = id => Path.join(__dirname, 'extensions', id)

module.exports = function getExtensions(names) {
  const extensions = names.map(extensionToID).map(extensionIDToPath)
  return extensions
}

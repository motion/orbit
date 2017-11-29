import Path from 'path'
import * as Constants from '~/constants'

const EXTENSIONS = {
  mobx: 'fmkadmapgofadopljbjfkapdkoienihi',
  react: 'pfgnfdagidkfgccljigdamigbcnndkod',
}

const extensionToID = name => EXTENSIONS[name]
const extensionIDToPath = id =>
  Path.join(Constants.ROOT_PATH, '..', 'resources', 'extensions', id)

export default function getExtensions(names) {
  const extensions = names.map(extensionToID).map(extensionIDToPath)
  return extensions
}

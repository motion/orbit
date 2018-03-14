import os from 'os'
import fs from 'fs'
import { search } from 'cerebro-tools'

const readDir = path =>
  new Promise((resolve, reject) => {
    fs.readdir(path, (err, files) => (err ? reject(err) : resolve(files)))
  })

const DIR_REGEXP = /^([a-z]:)?[\\/](.*[\\/])*(.*)/i
const HOME_DIR_REGEXP = /^~/
const USER_PATH = os
  .homedir()
  .trim('/')
  .trim('\\')

/**
 * Do not show some files in results, i.e. system files
 *
 * @param  {String} fileName
 * @return {Boolean}
 */
const ignoreFile = fileName => fileName.match(/^\./)

/**
 * Plugin to look and display local and external IPs
 * @param  {String} options.term
 * @param  {Function} options.display
 */
export const fn = ({ term, actions, display }) => {
  let path = term
  let replaceHomePath = false
  if (path.match(HOME_DIR_REGEXP)) {
    path = path.replace(HOME_DIR_REGEXP, USER_PATH)
    replaceHomePath = true
  }
  const match = path.match(DIR_REGEXP)
  if (match) {
    const windowsDrive = match[1] || ''
    const dir = windowsDrive + (match[2] ? `/${match[2]}` : '/')
    const fileName = match[3]
    readDir(dir)
      .then(files => (fileName ? search(files, fileName) : files))
      .then(files => {
        const result = []
        files.forEach(file => {
          if (ignoreFile(file)) return
          const filePath = [dir, file].join('')
          let autocomplete = replaceHomePath
            ? '~' + filePath.substr(USER_PATH.length)
            : filePath
          if (fs.statSync(filePath).isDirectory()) {
            autocomplete += os.platform() === 'win32' ? '\\' : '/'
          }
          result.push({
            id: filePath,
            title: file,
            subtitle: filePath,
            clipboard: filePath,
            term: autocomplete,
            icon: filePath,
            onKeyDown: event => {
              if ((event.metaKey || event.ctrlKey) && event.keyCode === 82) {
                actions.reveal(filePath)
                event.preventDefault()
              }
            },
            onSelect: () => actions.open(`file://${filePath}`),
            getPreview: () => <Preview path={filePath} />,
          })
        })
        display(result)
      })
  }
}

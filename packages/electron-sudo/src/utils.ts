import fs from 'fs'
import child from 'child_process'

function promisify(fn) {
  return function() {
    return new Promise((resolve, reject) => {
      fn(...arguments, function() {
        if (arguments[0] instanceof Error) {
          reject(arguments[0])
        } else {
          resolve(...Array.prototype.slice.call(arguments, 1))
        }
      })
    })
  }
}

async function exec(cmd, options = {}) {
  return new Promise((resolve, reject) => {
    child.exec(cmd, options, (err, stdout, stderr) => {
      if (err) {
        return reject(err)
      }
      return resolve({ stdout, stderr })
    })
  })
}

function spawn(cmd, args, options = {}) {
  return child.spawn(cmd, args, { ...options, shell: true })
}

async function stat(target) {
  let _stat = promisify(fs.stat)
  try {
    let fileStat = await _stat(target)
    return fileStat
  } catch (err) {
    return null
  }
}

let open = promisify(fs.open),
  mkdir = promisify(fs.mkdir),
  readFile = promisify(fs.readFile),
  writeFile = promisify(fs.writeFile)

export { readFile, writeFile, spawn, exec, mkdir, stat, open }

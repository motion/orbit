import fs from 'fs'
import child from 'child_process'
import { promisify } from 'util'

export const exec = promisify(child.exec)

export function spawn(cmd, args, options = {}) {
  return child.spawn(cmd, args, { ...options, shell: true })
}

export async function stat(target) {
  let _stat = promisify(fs.stat)
  try {
    let fileStat = await _stat(target)
    return fileStat
  } catch (err) {
    return null
  }
}

export const open = promisify(fs.open)
export const mkdir = promisify(fs.mkdir)
export const readFile = promisify(fs.readFile)
export const writeFile = promisify(fs.writeFile)
export const unlink = promisify(fs.unlink)

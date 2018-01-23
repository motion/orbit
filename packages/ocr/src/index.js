import execa from 'execa'
import Fs from 'fs-extra'
import Path from 'path'

const pyDir = Path.join(__dirname, '..', 'python')
const ocrFilePath = Path.join(pyDir, 'data', 'ocr.csv')
const ocrScriptPath = Path.join(pyDir, 'src', 'test.py')

export default async function(inputFile) {
  console.log('copy', inputFile, ocrFilePath)
  try {
    await Fs.copy(inputFile, ocrFilePath)
  } catch (err) {
    throw err
  }
  const cmd = `python3 ./src/test.py`
  console.log('$', cmd)
  const shell = execa.shell(`pwd && ${cmd}`, {
    cwd: pyDir,
  })
  shell.stdout.setEncoding('utf8')
  // shell.stdout.on('data', x => console.log(x))
  // shell.stderr.on('data', x => console.log(x))
  const answer = await shell
  return answer.stdout
}

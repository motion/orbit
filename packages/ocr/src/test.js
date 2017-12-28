import ocr from './index'
import Path from 'path'

const opts = {
  inputFile: Path.join(__dirname, '..', 'test-screen.png'),
}

console.log(opts)

async function test() {
  console.time('rust')
  const res = await ocr(opts)
  console.timeEnd('rust')
  console.log(JSON.stringify(res, 0, 2))
}

test()

import ocr from './index'

const opts = {
  bounds: [500, 300],
  offset: [100, 700],
  scale: 1,
  contrast: 10,
}

console.log(opts)

async function test() {
  console.log('rust')
  console.time('rust')
  await ocr(opts)
  console.timeEnd('rust')

  console.log('\n')

  console.log('cpp')
  console.time('cpp')
  await ocr({
    ...opts,
    alt: true,
  })
  console.timeEnd('cpp')
}

test()

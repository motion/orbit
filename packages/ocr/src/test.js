import ocr from './index'

async function test() {
  console.log(
    await ocr({
      bounds: [500, 300],
      offset: [100, 700],
      scale: 1,
      contrast: 10,
    }),
  )
}

test()

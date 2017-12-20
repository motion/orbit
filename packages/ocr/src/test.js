import ocr from './index'

async function test() {
  console.log(
    await ocr({
      bounds: [500, 500],
      offset: [100, 100],
    }),
  )
}

test()

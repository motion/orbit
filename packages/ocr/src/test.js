import ocr from './index'

const runOptions = {
  bounds: [500, 500],
  offset: [100, 100],
}

async function test() {
  console.log(await ocr(runOptions))

  console.log(
    await ocr({
      old: true,
      ...runOptions,
    }),
  )
}

test()

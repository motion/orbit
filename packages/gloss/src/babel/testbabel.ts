import { transform } from '../transform'

async function test() {
  const { cssText } = await transform(
    `
      import { gloss } from 'gloss'

      export const View = gloss({
        background: [0,0,0],
        transform: {
          y: 10,
          rotate: '10deg'
        },
        border: [[10, 10, [0,0,0,0.1]]],
      })
    `,
    {
      filename: './test.js',
      outputFilename: '../.gloss-cache/test.css',
    },
  )

  console.log('cssText', cssText)
}

test()

import dedent from 'dedent'

import { transform } from '../src/transform'

it('works', async () => {
  const { cssText } = await transform(
    dedent`
      import { gloss } from 'gloss'

      export const View = gloss({
        background: [0,0,0],
        transform: {
          y: 10
        }
      })
    `,
    {
      filename: './test.js',
      outputFilename: '../.gloss-cache/test.css',
    },
  )

  expect(cssText).toBe(`background:rgb(0,0,0);transform:translateY(10px);`)
  // expect(cssText).toMatchSnapshot()
})

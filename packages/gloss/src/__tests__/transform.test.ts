import { transform } from '../transform'
import dedent from 'dedent'

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

  expect(cssText).toMatchSnapshot()
})

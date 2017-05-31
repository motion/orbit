import { view } from '~/helpers'
import { PassThrough, Segment, Button } from '~/ui'
import { BLOCKS, MARKS } from '../constants'

@view
export default class ContextBar {
  render({ editorStore }) {
    const { pluginCategories } = editorStore
    const PAD = 40

    return (
      <bar $$row>
        {pluginCategories.map(category => (
          <Segment theme="dark" padded key={category}>
            {editorStore.buttonsFor(category).map((button, i) => (
              <PassThrough editorStore={editorStore} key={i}>
                {button}
              </PassThrough>
            ))}
          </Segment>
        ))}
      </bar>
    )
  }
}

import { view } from '~/helpers'
import { Theme, PassThrough, Segment } from '~/ui'

@view
export default class ContextBar {
  render({ editorStore }) {
    return (
      <bar $$row>
        {editorStore.pluginCategories.map(category => (
          <Segment theme="dark" padded key={category}>
            {editorStore.fromPlugin(category).map((button, i) => (
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

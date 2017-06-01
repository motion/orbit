import { view } from '~/helpers'
import { Theme, PassThrough, Segment } from '~/ui'

@view
export default class ContextBar {
  render({ editorStore }) {
    return (
      <bar $$row>
        {editorStore.pluginCategories.map(category => (
          <Segment padded key={category}>
            {editorStore.barButtonsFor(category).map((button, i) => (
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

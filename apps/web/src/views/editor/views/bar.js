import React from 'react'
import { view } from '@mcro/black'
import { PassThrough, Segment } from '@mcro/ui'

@view
export default class ContextBar {
  render({ editorStore }) {
    return (
      <bar $$row if={false}>
        <Segment padded>
          {editorStore.pluginCategories.map(category =>
            editorStore.helpers.barButtonsFor(category).map((button, i) =>
              <PassThrough editorStore={editorStore} key={i}>
                {button}
              </PassThrough>
            )
          )}
        </Segment>
      </bar>
    )
  }
}

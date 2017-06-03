import React from 'react'
import { view } from '~/helpers'
import { Theme, PassThrough, Segment } from '~/ui'

@view
export default class ContextBar {
  render({ editorStore }) {
    return (
      <bar $$row>
        <Segment padded>
          {editorStore.pluginCategories.map(category =>
            editorStore.helpers.barButtonsFor(category).map((button, i) => (
              <PassThrough editorStore={editorStore} key={i}>
                {button}
              </PassThrough>
            ))
          )}
        </Segment>
      </bar>
    )
  }
}

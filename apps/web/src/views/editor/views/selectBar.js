import React from 'react'
import { view } from '@mcro/black'
import * as UI from '@mcro/ui'

@view
export default class SelectBar {
  render({ editorStore }) {
    const { selection, pluginCategories } = editorStore

    return (
      <UI.Popover
        if={selection.selectedNode && selection.mouseUp && !editorStore.inline}
        open
        noArrow
        left={selection.mouseUp.x}
        top={selection.mouseUp.y + 18}
        swayX
        closeOnEsc
        theme="dark"
        background="transparent"
      >
        <bar $$row>
          {pluginCategories.map(category =>
            <UI.Segment margin={[0, 5]} key={category}>
              {editorStore.helpers
                .contextButtonsFor(category)
                .map((button, i) =>
                  <UI.PassProps editorStore={editorStore} key={i}>
                    {button}
                  </UI.PassProps>
                )}
            </UI.Segment>
          )}
        </bar>
      </UI.Popover>
    )
  }
}

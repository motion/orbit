import React from 'react'
import { view } from '@o/black'
import * as UI from '@o/ui'

@view
export default class SelectBar {
  render({ editorStore }) {
    const { selection, pluginCategories } = editorStore

    return (
      <UI.Popover
        if={!editorStore.inline}
        open={selection.selectedNode && selection.mouseUp}
        noArrow
        left={selection.mouseUp ? selection.mouseUp.x : 0}
        top={selection.mouseUp ? selection.mouseUp.y + 18 : 0}
        closeOnEsc
        theme="dark"
        background="transparent"
      >
        <bar $$row>
          {pluginCategories.map(category =>
            <UI.Row margin={[0, 5]} key={category}>
              {editorStore.helpers
                .contextButtonsFor(category)
                .map((button, i) =>
                  <UI.PassProps editorStore={editorStore} key={i}>
                    {button}
                  </UI.PassProps>
                )}
            </UI.Row>
          )}
        </bar>
      </UI.Popover>
    )
  }
}

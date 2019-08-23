import * as UI from '@o/ui'
import React from 'react'

export function SelectBar({ editorStore }) {
  const { selection, pluginCategories } = editorStore

  return editorStore.inline ? null : (
    <UI.Popover
      open={selection.selectedNode && selection.mouseUp}
      noArrow
      left={selection.mouseUp ? selection.mouseUp.x : 0}
      top={selection.mouseUp ? selection.mouseUp.y + 18 : 0}
      closeOnEsc
      theme="dark"
      background="transparent"
    >
      <bar $$row>
        {pluginCategories.map(category => (
          <UI.Row margin={[0, 5]} key={category}>
            {editorStore.helpers.contextButtonsFor(category).map((button, i) => (
              <UI.PassProps editorStore={editorStore} key={i}>
                {button}
              </UI.PassProps>
            ))}
          </UI.Row>
        ))}
      </bar>
    </UI.Popover>
  )
}

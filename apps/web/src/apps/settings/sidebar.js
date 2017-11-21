import * as React from 'react'
import { view } from '@mcro/black'
import PaneView from '~/apps/panes/pane'

@view
export default class SettingsSidebar {
  static defaultProps = {
    width: 280,
  }

  render({ width, onSelect, ...props }) {
    return (
      <sidebar css={{ width }}>
        <PaneView
          width={width}
          sidebar
          groupBy="category"
          onSelect={onSelect}
          getItem={item => item}
          itemProps={{
            size: 1.1,
            padding: [8, 12],
            glow: true,
            glowProps: {
              color: '#fff',
              scale: 1,
              blur: 70,
              opacity: 0.1,
              show: false,
              resist: 60,
              zIndex: -1,
            },
            highlightBackground: [255, 255, 255, 0.08],
            childrenEllipse: 2,
          }}
          {...props}
        />
      </sidebar>
    )
  }
}

import { view } from '@mcro/black'
import * as UI from '@mcro/ui'
import Measure from 'react-measure'

@view({
  store: class CollapseBodyStore {
    height = null
  },
})
export default class CollapseBody {
  render({ open, store, children }) {
    return (
      <container css={{ height: open ? store.height : 0 }}>
        <Measure
          bounds
          onMeasure={contentRect => {
            store.height = contentRect.bounds.height
          }}
          onResize={contentRect => {
            store.height = contentRect.bounds.height
          }}
        >
          {({ measureRef }) => (
            <inner ref={measureRef} $hidden={!open}>
              {children}
            </inner>
          )}
        </Measure>
      </container>
    )
  }

  static style = {
    container: {
      overflow: 'hidden',
    },
    inner: {
      transition: 'all 220ms cubic-bezier(0.175, 0.885, 0.320, 1.275)',
      transformOrigin: '0% 0%',
      opacity: 1,
      transform: { y: 0 },
    },
    hidden: {
      transform: { y: 7 },
      opacity: 0,
    },
  }
}

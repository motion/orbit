import { view } from '@mcro/black'
import * as UI from '@mcro/ui'
import { Thing } from '~/app'
import { OS } from '~/helpers'

@view
export default class After {
  render({ navigate, thing, children, ...props }) {
    return (
      <after
        onClick={e => {
          OS.send('peek-target', null)
          e.preventDefault()
          e.stopPropagation()
          navigate({
            ...Thing.toResult(thing),
            type: 'context',
          })
        }}
        {...props}
      >
        <UI.Icon opacity={0.1} size={13} name="arrow-min-right" />
        {children}
      </after>
    )
  }
  static style = {
    after: {
      position: 'relative',
      zIndex: 1000,
      margin: -7,
      marginRight: -2,
      marginLeft: 7,
      padding: 2,
      alignItems: 'center',
      justifyContent: 'center',
      flex: 1,
      '&:hover': {
        background: [255, 255, 255, 0.025],
      },
    },
  }
}

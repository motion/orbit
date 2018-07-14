import { view } from '@mcro/black'
import * as React from 'react'
import * as Constants from '~/constants'

@view
class SectionContent extends React.Component {
  render({ padded, forwardRef, ...props }) {
    return (
      <section
        ref={forwardRef}
        $section
        $padVertical={padded}
        $padHorizontal={!!padded}
        {...props}
      />
    )
  }

  static style = {
    section: {
      width: '100%',
      minWidth: Constants.smallSize,
      maxWidth: Constants.mediumSize,
      margin: [0, 'auto'],
      padding: [0, Constants.sidePad],
      position: 'relative',
      pointerEvents: 'none',
      '& > *': {
        pointerEvents: 'auto',
      },
      [Constants.screen.smallQuery]: {
        width: '100%',
        height: 'auto',
        minWidth: 'auto',
        maxWidth: 'auto',
        padding: [0, '5%'],
      },
    },
    padVertical: padding => ({
      paddingTop: padding !== true ? padding : 80,
      paddingBottom: padding !== true ? padding : 80,
    }),
    padHorizontal: {
      paddingLeft: Constants.sidePad,
      paddingRight: Constants.sidePad,
      [Constants.screen.smallQuery]: {
        paddingLeft: '5%',
        paddingRight: '5%',
      },
    },
  }
}

export default React.forwardRef((props, ref) => (
  <SectionContent forwardRef={ref} {...props} />
))

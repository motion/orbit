import { view } from '@mcro/black'
import * as React from 'react'
import * as Constants from '~/constants'
import { debounce } from 'lodash'

@view
class SectionContent extends React.Component {
  state = {
    resize: false,
  }

  componentDidMount() {
    this.on(
      window,
      'resize',
      debounce(() => {
        this.setState({ resize: Math.random() })
      }, 300),
    )
  }

  render({
    padded,
    halfscreen,
    fullscreen,
    fullscreenFs,
    fullscreenFixed,
    ...props
  }) {
    const isSmall = window.innerWidth <= Constants.screen.small.maxWidth
    let height = 'auto'
    if (fullscreenFixed) {
      height = Math.max(800, window.innerHeight)
    }
    if (halfscreen || fullscreen) {
      height = Math.max(
        isSmall || fullscreenFs ? 500 : 1000,
        Math.min(Constants.sectionMaxHeight, window.innerHeight),
      )
    }
    if (halfscreen) {
      height = height / 2.3
      height = Math.max(420, height)
    }
    const style = isSmall ? { minHeight: height } : { height }
    return (
      <section
        $padVertical={padded}
        $padHorizontal={!!padded}
        $halfscreen={halfscreen}
        $fullscreen={fullscreen}
        $fullscreenFixed={fullscreenFixed}
        css={style}
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
      [Constants.screen.smallQuery]: {
        width: '100%',
        height: 'auto',
        minWidth: 'auto',
        maxWidth: 'auto',
        padding: [0, '5%'],
      },
    },
    halfscreen: {
      flexFlow: 'row',
      padding: [80 + 60, 0, 60],
      [Constants.screen.smallQuery]: {
        flexFlow: 'column',
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

export default SectionContent

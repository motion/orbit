import { view } from '@mcro/black'
import * as React from 'react'
import * as Constants from '~/constants'
import { debounce } from 'lodash'

@view
export class SectionContent extends React.Component {
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

  render({ padded, halfscreen, fullscreen, fullscreenFixed, ...props }) {
    const isSmall = window.innerWidth <= Constants.screen.small.maxWidth
    let height = 'auto'
    if (fullscreenFixed) {
      height = Math.max(800, window.innerHeight)
    }
    if (halfscreen || fullscreen) {
      height = Math.max(
        isSmall ? 500 : 1000,
        Math.min(Constants.sectionMaxHeight, window.innerHeight),
      )
    }
    if (halfscreen) {
      height = height / 2.3
      height = Math.max(420, height)
    }
    const style = isSmall ? { minHeight: height } : { height }
    console.log(__dom)
    return (
      <section
        $padded={padded}
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
        padding: [0, Constants.sidePad / 2],
      },
    },
    halfscreen: {
      flexFlow: 'row',
      padding: [80 + 60, 0, 60],
      [Constants.screen.smallQuery]: {
        flexFlow: 'column',
      },
    },
    padded: {
      padding: [80, Constants.sidePad],
      [Constants.screen.smallQuery]: {
        padding: [80, Constants.sidePad / 2],
      },
    },
  }
}

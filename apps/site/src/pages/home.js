import * as React from 'react'
import { view } from '@mcro/black'
import * as View from '~/views'
import Ora from './home/ora'
import HomeHeader from './home/header'
import HomeHandsFree from './home/sectionHandsFree'
import HomeSecurity from './home/sectionSecurity'
import HomeChat from './home/sectionChat'
import HomeExamples from './home/sectionExamples'

@view.provide({
  homeStore: class HomeStore {
    ready = false

    willMount() {
      window.homeStore = this
      this.setTimeout(() => {
        this.ready = true
      }, 16)
    }

    willUnmount() {
      this.unmounted = true
    }

    setSection = (key, options = { percentFromTop: 50 }) => {
      return node => {
        if (node) {
          const { top, bottom } = node.getBoundingClientRect()
          this.bounds = {
            ...this.bounds,
            [key]: {
              ...options,
              top,
              bottom,
            },
          }
        }
      }
    }
  },
})
@view
export default class HomePage extends React.Component {
  render({ homeStore, isSmall }) {
    const sectionProps = {
      isSmall,
      homeStore,
      setSection: homeStore.setSection,
    }
    return (
      <page>
        <HomeHeader />
        <Ora if={homeStore.ready && !isSmall} homeStore={homeStore} />
        <HomeExamples {...sectionProps} />
        <HomeChat {...sectionProps} />
        <HomeSecurity {...sectionProps} />
        <HomeHandsFree {...sectionProps} />
        <View.Footer />
      </page>
    )
  }

  static style = {
    page: {
      height: '100%',
      overflowX: 'hidden',
      overflowY: 'scroll',
      position: 'relative',
      // dont do this causes tons of paints:
      // transform: { z: 0 },
    },
    contents: {},
    '@keyframes orbital0': {
      from: {
        transform: 'rotate(0deg) translateX(150px) rotate(0deg)',
      },
      to: {
        transform: 'rotate(360deg) translateX(150px) rotate(-360deg)',
      },
    },
    '@keyframes orbital1': {
      from: {
        transform: 'rotate(0deg) translateX(300px) rotate(0deg)',
      },
      to: {
        transform: 'rotate(360deg) translateX(300px) rotate(-360deg)',
      },
    },
    '@keyframes orbital2': {
      from: {
        transform: 'rotate(0deg) translateX(450px) rotate(0deg)',
      },
      to: {
        transform: 'rotate(360deg) translateX(450px) rotate(-360deg)',
      },
    },
  }
}

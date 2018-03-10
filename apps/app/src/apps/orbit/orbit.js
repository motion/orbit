// @flow
import * as React from 'react'
import { debounce } from 'lodash'
import { view } from '@mcro/black'
import * as UI from '@mcro/ui'
import { App, Electron } from '@mcro/all'
import Knowledge from './knowledge'
import OrbitContent from './orbitContent'
import OrbitSettings from './orbitSettings'
import { Thing } from '@mcro/models'
import Search from '@mcro/search'
import OrbitHeader from './orbitHeader'

const SHADOW_PAD = 15
const BORDER_RADIUS = 12
// const BORDER_COLOR = `rgba(255,255,255,0.25)`
const background = 'rgba(0,0,0,0.9)'
const orbitShadow = [[0, 3, SHADOW_PAD, [0, 0, 0, 0.05]]]
const log = debug('orbit')

@view.provide({
  orbitStore: class OrbitStore {
    searchStore = new Search()
    isTorn = false
    isPinned = false
    query = 'test'
    results = []
    showSettings = false

    willMount() {
      App.runReactions()

      setTimeout(async () => {
        console.log('adding docs to search...')
        const allDocs = await Thing.getAll()
        this.searchStore.setDocuments(
          allDocs.map(doc => ({ title: doc.title, text: doc.body })),
        )
      })
      // react to do searches
      this.react(() => this.query, this.search, true)
    }

    onChangeQuery = e => {
      this.query = e.target.value
    }

    toggleSettings = () => {
      this.showSettings = !this.showSettings
    }

    search = debounce(async () => {
      const { results } = await this.searchStore.search.search(this.query)
      if (!results) return
      this.results = results
    }, 150)
  },
})
@view.attach('orbitStore')
@view
export default class OrbitPage {
  render({ orbitStore }) {
    const arrowTowards = Electron.orbitState.arrowTowards || 'right'
    const arrowSize = 28
    let arrowStyle
    let orbitStyle
    switch (arrowTowards) {
      case 'right':
        orbitStyle = {
          // marginRight: -4,
        }
        arrowStyle = {
          top: 53,
          right: SHADOW_PAD - arrowSize,
        }
        break
      case 'left':
        orbitStyle = {
          // marginLeft: -2,
        }
        arrowStyle = {
          top: 53,
          left: -3,
        }
        break
    }
    console.log('Orbit.render, hidden', App.state.orbitHidden)
    return (
      <UI.Theme name="dark">
        <orbit css={orbitStyle} $orbitVisible={!App.state.orbitHidden}>
          {/* first is arrow (above), second is arrow shadow (below) */}
          {[1, 2].map(key => (
            <UI.Arrow
              if={!orbitStore.isTorn}
              key={key}
              size={arrowSize}
              towards={arrowTowards}
              background={background}
              css={{
                position: 'absolute',
                ...arrowStyle,
                ...[
                  {
                    boxShadow: orbitShadow,
                    zIndex: -1,
                  },
                  {
                    zIndex: 100,
                  },
                ][key],
              }}
            />
          ))}
          <content>
            <OrbitHeader />
            <OrbitContent if={!orbitStore.showSettings} />
            <OrbitSettings if={orbitStore.showSettings} />
            <Knowledge if={App.state.knowledge} data={App.state.knowledge} />
            <controls
              css={{
                position: 'absolute',
                top: 18,
                right: 18,
                zIndex: 10000,
              }}
            >
              <UI.Button
                icon="gear"
                borderRadius={100}
                size={0.8}
                opacity={0.25}
                circular
                chromeless
                highlight={orbitStore.showSettings}
                onClick={orbitStore.toggleSettings}
              />
            </controls>
          </content>
        </orbit>
      </UI.Theme>
    )
  }

  static style = {
    orbit: {
      alignSelf: 'flex-end',
      width: '100%',
      height: '100%',
      padding: SHADOW_PAD,
      pointerEvents: 'none !important',
      position: 'relative',
      transition: 'all ease-in 100ms',
      opacity: 0,
    },
    orbitVisible: {
      pointerEvents: 'all !important',
      opacity: 1,
      transition: 'all ease-out 100ms',
    },
    orbitTorn: {
      pointerEvents: 'all !important',
      opacity: 1,
      transform: {
        y: 0,
      },
    },
    content: {
      flex: 1,
      // border: [1, 'transparent'],
      background,
      borderRadius: BORDER_RADIUS,
      overflow: 'hidden',
      opacity: 1,
      transition: 'background ease-in 200ms',
      // boxShadow: [orbitShadow, `0 0 0 0.5px ${BORDER_COLOR}`],
    },
  }
}

// @flow
import * as React from 'react'
import { view } from '@mcro/black'

@view({
  store: class HighlightsStore {
    electronState = {}
    hoveredWord = null

    // [ { top, left, height, width }, ... ]
    get highlights() {
      return (
        (this.electronState.context && this.electronState.context.highlights) ||
        []
      )
    }

    willMount() {
      this.listenToElectronState()
      this.watchForHoverWord()
    }

    listenToElectronState = () => {
      this.electronBus = new BroadcastChannel('ora-electron-state')
      this.electronBus.onmessage = ({ data }) => {
        this.electronState = data
      }
      this.subscriptions.add(() => this.electronBus.close())
    }

    watchForHoverWord = () => {
      console.log('watchForHoverWord')
      this.react(
        () => [this.electronState.mousePosition || {}, this.highlights],
        ([{ x, y }, highlights]) => {
          console.log('watchForHoverWord [{ x, y }, highlights]', [
            { x, y },
            highlights,
          ])
          let hovered = null
          for (const word of highlights) {
            // outside of x
            if (x < word.left || x > word.left + word.width) {
              continue
            }
            // outside of y
            if (y < word.top || y > word.top + word.height) {
              continue
            }
            // we good tho
            hovered = word
            break
          }
          this.hoveredWord = hovered
        },
      )
    }
  },
})
export default class HighlightsPage {
  render({ store }) {
    const { highlights, hoveredWord } = store
    return (
      <highlights>
        {store.highlights.map(hl => (
          <highlight
            key={hl.key}
            $hlPosition={hl}
            $hovered={hoveredWord && hl.key === hoveredWord.key}
          />
        ))}
      </highlights>
    )
  }

  static style = {
    highlights: {
      width: '100%',
      height: '100%',
      pointerEvents: 'none',
      userSelect: 'none',
      position: 'relative',
      // background: [0, 255, 0, 0.1],
    },
    highlight: {
      position: 'absolute',
      background: 'red',
    },
    hlPosition: ({ top, left, width, height }) => ({
      top,
      left,
      width,
      height,
    }),
    hovered: {
      background: 'green',
    },
  }
}

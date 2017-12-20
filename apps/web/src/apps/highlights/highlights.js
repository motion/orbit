// @flow
import * as React from 'react'
import { view } from '@mcro/black'
import * as Helpers from '~/helpers'

const HL_PAD = 5

const getHoverProps = Helpers.hoverSettler({
  enterDelay: 400,
  onHovered: object => {
    console.log('SEND PEEK', object)
    Helpers.OS.send('peek-target', object)
  },
})

function toEvent({ top, left, width, height }) {
  return {
    currentTarget: {
      offsetTop: top,
      offsetLeft: left,
      clientHeight: height,
      clientWidth: width,
    },
  }
}

@view({
  store: class HighlightsStore {
    electronState = {}
    hoveredWord = null
    hoverEvents = {}

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
      // update hoverEvents for use in hover logic
      this.react(
        () => this.highlights,
        hls => {
          const hoverEvents = {}
          for (const { key } of hls) {
            hoverEvents[key] = getHoverProps({ key, id: key })
          }
          this.hoverEvents = hoverEvents
        },
      )

      this.react(
        () => [
          this.electronState.mousePosition || {},
          // update when hover event handlers change
          this.hoverEvents,
        ],
        ([{ x, y }, hoverEvents]) => {
          const highlights = this.highlights
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
          // before update, handle hover logic
          // mouseLeave
          if (!hovered && this.hoveredWord) {
            if (hoverEvents[this.hoveredWord.key]) {
              hoverEvents[this.hoveredWord.key].onMouseLeave()
            }
          } else if (hovered && !this.hoveredWord) {
            // mouseEnter
            if (hoverEvents[hovered.key]) {
              hoverEvents[hovered.key].onMouseEnter(toEvent(hovered))
            }
          } else if (hovered) {
            // mouseMove
            if (hoverEvents[hovered.key]) {
              hoverEvents[hovered.key].onMouseMove(toEvent(hovered))
            }
          }
          // update state
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
      padding: HL_PAD,
      borderRadius: 10,
      background: [255, 255, 255, 0.1],
    },
    hlPosition: ({ top, left, width, height }) => ({
      top: top - HL_PAD,
      left: left - HL_PAD,
      width: width + HL_PAD * 2,
      height: height + HL_PAD * 2,
    }),
    hovered: {
      background: [255, 255, 255, 0.3],
    },
  }
}

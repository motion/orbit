// @flow
import * as React from 'react'
import { view } from '@mcro/black'
import * as Helpers from '~/helpers'

const HL_PAD = 2
const TOP_BAR_SIZE = 22

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

class HighlightsStore {
  electronState = {}
  hoveredWord = null
  hoverEvents = {}
  showHighlights = true

  get context() {
    return this.props.contextStore
  }

  // [ { top, left, height, width }, ... ]
  get highlights() {
    return ((this.context && this.context.ocrWords) || []).map(
      ([left, top, width, height, word], index) => ({
        top,
        left,
        width,
        height,
        word,
        key: `${index}-${word}-${top}-${left}`,
      }),
    )
  }

  willMount() {
    // start context watching
    this.props.contextStore.start()

    this.watchForHoverWord()

    // hide highlights on screen diff
    this.react(
      () => this.context.lastScreenChange,
      () => {
        if (this.context.lastScreenChange > this.context.lastOCR) {
          console.log('diff, hide highlights')
          this.showHighlights = false
        }
      },
    )

    // show highlights on new ocr
    this.react(
      () => this.context.lastOCR,
      () => {
        console.log('show highlights')
        this.showHighlights = true
      },
    )
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
        this.context.mousePosition || [],
        // update when hover event handlers change
        this.hoverEvents,
        this.highlights,
      ],
      ([[x, _y], hoverEvents, highlights]) => {
        if (!x || !_y) {
          return
        }
        let y = _y - TOP_BAR_SIZE
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
          console.log('hovered', hovered)
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
}

@view.attach('contextStore')
@view({
  store: HighlightsStore,
})
export default class HighlightsPage {
  render({ store }) {
    const { highlights, hoveredWord } = store
    console.log('render highlights', highlights)
    return (
      <contain $highlights>
        <highlights if={store.showHighlights}>
          {store.highlights.map(({ key, top, left, width, height, word }) => (
            <highlight
              key={key}
              $hovered={hoveredWord && key === hoveredWord.key}
              style={{
                top: top - HL_PAD - 24,
                left: left - HL_PAD,
                width: width + HL_PAD * 2,
                height: height + HL_PAD * 2,
              }}
            >
              <word>{word}</word>
            </highlight>
          ))}
        </highlights>
      </contain>
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
      borderRadius: 8,
      background: [200, 200, 200, 0.5],
    },
    hovered: {
      background: [180, 180, 180, 0.3],
    },
    word: {
      opacity: 0,
      position: 'absolute',
      top: 0,
      left: HL_PAD,
      wordWrap: 'no-wrap',
      whiteSpace: 'pre',
    },
  }
}

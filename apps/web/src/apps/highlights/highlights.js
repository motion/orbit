// @flow
import * as React from 'react'
import { view } from '@mcro/black'
import * as Helpers from '~/helpers'

const HL_PAD = 2
const TOP_BAR_PAD = 22
const getHoverProps = Helpers.hoverSettler({
  enterDelay: 400,
  onHovered: object => {
    console.log('SEND PEEK', object)
    // Helpers.OS.send('peek-target', object)
  },
})
const toEvent = ([left, top, width, height]) => {
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
      () => [...this.context.ocrWords, ...this.context.linePositions] || [],
      hls => {
        const hoverEvents = {}
        for (const { key } of hls) {
          hoverEvents[key] = getHoverProps({ key, id: key })
        }
        this.hoverEvents = hoverEvents
      },
    )

    // track hovers on words
    this.react(
      () => [
        this.context.mousePosition || [],
        // update when hover event handlers change
        this.hoverEvents,
        this.highlights,
      ],
      this.handleHoverOn('hoveredWord'),
    )

    // track hovers on lines
    this.react(
      () => [
        this.context.mousePosition || [],
        // update when hover event handlers change
        this.hoverEvents,
        this.lines,
      ],
      this.handleHoverOn('hoveredWord'),
    )
  }

  handleHoverOn = key => ([[x, _y], hoverEvents, items]) => {
    if (!x || !_y) {
      return
    }
    let y = _y
    let hovered = null
    for (const word of items) {
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
    this[key] = hovered
  }
}

@view.attach('contextStore')
@view({
  store: HighlightsStore,
})
export default class HighlightsPage {
  render({ store }) {
    const { context, hoveredWord, hoveredLine } = store
    return (
      <contain $highlights>
        <frame if={store.showHighlights}>
          {(context.ocrWords || []).map(([left, top, width, height, word]) => (
            <word
              key={`${x}${y}${width}${height}`}
              $hovered={hoveredWord && key === hoveredWord.key}
              style={{
                top: top - HL_PAD - TOP_BAR_PAD,
                left: left - HL_PAD,
                width: width + HL_PAD * 2,
                height: height + HL_PAD * 2,
              }}
            >
              <wordInner>{word}</wordInner>
            </word>
          ))}
          {(context.linePositions || []).map(([x, y, width, height]) => (
            <line
              key={`${x}${y}${width}${height}`}
              $hoveredLine={hoveredLine && key === hoveredLine.key}
              style={{
                left: x - TOP_BAR_PAD,
                top: x,
                width: width,
                height: height,
              }}
            />
          ))}
        </frame>
      </contain>
    )
  }

  static style = {
    frame: {
      width: '100%',
      height: '100%',
      pointerEvents: 'none',
      userSelect: 'none',
      position: 'relative',
      // background: [0, 255, 0, 0.1],
    },
    word: {
      position: 'absolute',
      padding: HL_PAD,
      borderRadius: 8,
      background: [200, 200, 200, 0.5],
    },
    hovered: {
      background: [250, 0, 0, 0.5],
    },
    wordInner: {
      opacity: 0,
      position: 'absolute',
      top: 0,
      left: HL_PAD,
      wordWrap: 'no-wrap',
      whiteSpace: 'pre',
    },
    line: {
      position: 'absolute',
      borderBottom: [2, [0, 0, 0, 0.2]],
    },
    lineHovered: {
      borderBottomColor: 'blue',
    },
  }
}

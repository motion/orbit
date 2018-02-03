// @flow
import * as React from 'react'
import { view } from '@mcro/black'
import * as Helpers from '~/helpers'

const HL_PAD = 2
const TOP_BAR_PAD = 22
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
  version = 0
  electronState = {}
  hoveredWord = null
  hoveredLine = null
  hoverEvents = {}
  showAll = true

  get context() {
    return this.props.contextStore
  }

  get ocrWords() {
    return (this.context.ocrWords || []).filter(
      (_, index) => !this.context.clearWords[index],
    )
  }

  // test words
  // get ocrWords() {
  //   return [
  //     [100, 60, 120, 10, 'xx', 'red'],
  //     [1500, 60, 120, 10, 'xx', 'red'],
  //     [1500, 1000, 120, 10, 'xx', 'red'],
  //     [100, 1000, 120, 10, 'xx', 'red'],
  //     [800, 500, 120, 10, 'xx', 'red'],
  //   ]
  // }

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
          this.showAll = false
        }
      },
      true,
    )
    // show highlights on new ocr
    this.react(
      () => this.context.lastOCR,
      () => {
        console.log('show highlights')
        this.showAll = true
      },
      true,
    )
  }

  getHoverProps = Helpers.hoverSettler({
    enterDelay: 600,
    onHovered: object => {
      console.log('peek', object)
      Helpers.OS.send('peek-target', object)
    },
  })

  watchForHoverWord = () => {
    // update hoverEvents for use in hover logic
    this.react(
      () =>
        [...(this.ocrWords || []), ...(this.context.linePositions || [])] || [],
      hls => {
        const hoverEvents = {}
        for (const item of hls) {
          const key = this.getKey(item)
          hoverEvents[key] = this.getHoverProps({ key, id: key })
        }
        this.hoverEvents = hoverEvents
      },
      true,
    )

    // track hovers on words
    this.react(
      () => [
        this.context.mousePosition || [],
        // update when hover event handlers change
        this.hoverEvents,
        this.ocrWords || [],
      ],
      this.handleHoverOn('hoveredWord'),
      true,
    )

    // track hovers on lines
    this.react(
      () => [
        this.context.mousePosition || [],
        // update when hover event handlers change
        this.hoverEvents,
        this.context.linePositions || [],
      ],
      this.handleHoverOn('hoveredLine'),
      true,
    )
  }

  handleHoverOn = prop => ([[x, y], hoverEvents, items]) => {
    if (!x || !y) {
      return
    }
    let hovered = null
    for (const item of items) {
      const [x1, y1, w1, h1] = item
      // outside of x
      if (x < x1 || x > x1 + w1) {
        continue
      }
      // outside of y
      if (y < y1 || y > y1 + h1 + 3) {
        continue
      }
      // we good tho
      hovered = item
      break
    }

    // // TODO REMOVE BEFORE MERGE
    // // only do peeks on test squares
    // if (!hovered || !hovered[5]) return

    // before update, handle hover logic
    // mouseLeave
    const current = this[prop]
    if (!hovered && current) {
      if (hoverEvents[current]) {
        hoverEvents[current].onMouseLeave()
      }
    } else if (hovered && !current) {
      // mouseEnter
      if (hoverEvents[current]) {
        hoverEvents[current].onMouseEnter(toEvent(hovered))
      }
    } else if (hovered) {
      // mouseMove
      if (hoverEvents[current]) {
        hoverEvents[current].onMouseMove(toEvent(hovered))
      }
    }
    // update state
    this[prop] = hovered ? this.getKey(hovered) : null
  }

  getKey = ([x, y, w, h]) => `${x}${y}${w}${h}`
}

@view.attach('contextStore')
@view({
  store: HighlightsStore,
})
export default class HighlightsPage {
  render({ store }) {
    const { showAll, context, ocrWords, hoveredWord, hoveredLine } = store
    return (
      <frame if={showAll}>
        {(ocrWords || []).map(item => {
          const [x, y, width, height, word, color] = item
          const key = store.getKey(item)
          return (
            <word
              key={key}
              $hovered={hoveredWord && key === hoveredWord}
              $highlighted={context.highlightWords[word]}
              style={{
                top: y - HL_PAD - TOP_BAR_PAD,
                left: x - HL_PAD,
                width: width + HL_PAD * 2,
                height: height + HL_PAD * 2,
                background: color,
              }}
            >
              <wordInner>{word}</wordInner>
            </word>
          )
        })}
        {(context.linePositions || []).map(item => {
          const [x, y, width, height] = item
          const key = store.getKey(item)
          return (
            <ocrLine
              key={key}
              $hoveredLine={hoveredLine && key === hoveredLine}
              style={{
                top: y / 2 - TOP_BAR_PAD,
                left: x,
                width: width,
                height: height / 2 + 5, // add some padding
              }}
            />
          )
        })}
      </frame>
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
      // borderRadius: 3,
      // background: [200, 200, 200, 0.15],
    },
    highlighted: {
      borderBottom: [2, 'solid', '#EDD71E'],
    },
    hovered: {
      background: 'rgba(0,0,0,0.1) !important',
      opacity: 1,
    },
    wordInner: {
      opacity: 0.2,
      top: -14,
      left: -4,
      fontSize: 8,
      height: 10,
      position: 'absolute',
      wordWrap: 'no-wrap',
      whiteSpace: 'pre',
    },
    ocrLine: {
      marginTop: -4,
      position: 'absolute',
      borderBottom: [1, [0, 0, 0, 0.02]],
    },
    hoveredLine: {
      borderBottomColor: 'blue',
      opacity: 1,
    },
  }
}

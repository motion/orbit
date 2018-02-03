// @flow
import * as React from 'react'
import { view } from '@mcro/black'
import * as Helpers from '~/helpers'
import quadtree from 'simple-quadtree'

const HL_PAD = 2
const TOP_BAR_PAD = 22
const LINE_Y_ADJ = -5

class HighlightsStore {
  trees = {
    word: quadtree(0, 0, window.innerWidth, window.innerHeight),
    line: quadtree(0, 0, window.innerWidth, window.innerHeight),
  }
  version = 0
  electronState = {}
  hoverEvents = {}

  get context() {
    return this.props.contextStore
  }

  get ocrWords() {
    return (this.context.ocrWords || []).filter(
      (_, index) => !this.context.clearWords[index],
    )
  }

  get wordHovered() {
    const [x, y] = this.context.mousePosition || []
    return this.trees.word.get({ x, y, w: 0, h: 0 })
  }

  get lineHovered() {
    const [x, y] = this.context.mousePosition || []
    return this.trees.line.get({ x, y: y - LINE_Y_ADJ, w: 0, h: 0 })
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

  get showAll() {
    return this.context.lastOCR > this.context.lastScreenChange ? true : false
  }

  willMount() {
    // start context watching
    this.props.contextStore.start()
    this.react(() => ['word', this.ocrWords], this.setupHover, true)
    this.react(
      () => ['line', this.context.linePositions],
      this.setupHover,
      true,
    )
  }

  setupHover([name, items]) {
    if (!items) return
    if (!items.length) return
    this.trees[name].clear()
    this.hoverEvents = items.reduce((acc, item) => {
      const key = this.getKey(item)
      // side effect
      this.trees[name].put({
        x: item[0],
        y: item[1],
        w: item[2],
        h: item[3],
        string: key,
      })
      return {
        ...acc,
        [key]: this.getHoverProps({ key, id: key }),
      }
    }, {})
  }

  getHoverProps = Helpers.hoverSettler({
    enterDelay: 300,
    onHovered: object => {
      console.log('peek', object)
      Helpers.OS.send('peek-target', object)
    },
  })

  getKey = ([x, y, w, h]) => `${x}${y}${w}${h}`
}

@view
class Words {
  render({ store, store: { ocrWords, wordHovered, context } }) {
    return (ocrWords || []).map(item => {
      const [x, y, width, height, word, color] = item
      const key = store.getKey(item)
      return (
        <word
          key={key}
          $hovered={wordHovered.findIndex(x => x.string === key) >= 0}
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
    })
  }
  static style = {
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
  }
}

@view
class Lines {
  render({ store, store: { lineHovered, context } }) {
    return (context.linePositions || []).map(item => {
      const [x, y, width, height] = item
      const key = store.getKey(item)
      return (
        <ocrLine
          key={key}
          $hoveredLine={lineHovered.findIndex(x => x.string === key) >= 0}
          style={{
            top: y - TOP_BAR_PAD + LINE_Y_ADJ,
            left: x,
            width: width,
            height: height, // add some padding
          }}
        />
      )
    })
  }
  static style = {
    ocrLine: {
      borderBottom: [2, 'dotted', [0, 0, 0, 0.1]],
      position: 'absolute',
      opacity: 1,
    },
    hoveredLine: {
      borderBottom: [2, 'solid', '#EDD71E'],
    },
  }
}

@view.attach('contextStore')
@view({
  store: HighlightsStore,
})
export default class HighlightsPage {
  render({ store }) {
    return (
      <frame if={store.showAll}>
        <Words store={store} />
        <Lines store={store} />
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
  }
}

// @flow
import * as React from 'react'
import { view } from '@mcro/black'
import * as Helpers from '~/helpers'
import quadtree from 'simple-quadtree'
import Screen from '@mcro/screen-store'

const HL_PAD = 2
const TOP_BAR_PAD = 22
const LINE_Y_ADJ = -5
const getKey = ([x, y, w, h]) => `${x}${y}${w}${h}`

class HighlightsStore {
  trees = {
    word: quadtree(0, 0, window.innerWidth, window.innerHeight),
    line: quadtree(0, 0, window.innerWidth, window.innerHeight),
  }
  version = 0
  hoverEvents = {}

  get ocrWords() {
    return (Screen.apiState.ocrWords || []).filter(
      (_, index) => !Screen.apiState.clearWords[index],
    )
  }

  get wordHovered() {
    const [x, y] = Screen.apiState.mousePosition || []
    return this.trees.word.get({ x, y, w: 0, h: 0 })
  }

  get lineHovered() {
    const [x, y] = Screen.apiState.mousePosition || []
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
    return Screen.apiState.lastOCR > Screen.apiState.lastScreenChange
      ? true
      : false
  }

  willMount() {
    // start screen watching
    Screen.start('app')
    this.react(() => ['word', this.ocrWords], this.setupHover, true)
    this.react(
      () => ['line', Screen.apiState.linePositions],
      this.setupHover,
      true,
    )

    // watch option hold
    this.react(
      () => Screen.apiState.keyboard.option,
      val => {
        console.log('seeing screen keyboard option', val)
      },
    )
  }

  setupHover([name, items]) {
    if (!items) return
    if (!items.length) return
    this.trees[name].clear()
    this.hoverEvents = items.reduce((acc, item) => {
      const key = getKey(item)
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
      console.log('Screen.hoveredWord', object)
      Screen.setState({ hoveredWord: object })
    },
  })
}

@view
class OCRWord {
  render({ item, store: { wordHovered } }) {
    const [x, y, width, height, word, color] = item
    const key = getKey(item)
    return (
      <word
        $hovered={wordHovered.findIndex(x => x.string === key) >= 0}
        $highlighted={Screen.apiState.highlightWords[word]}
        style={{
          top: y - HL_PAD - TOP_BAR_PAD,
          left: x - HL_PAD,
          width: width + HL_PAD * 2,
          height: height + HL_PAD * 2,
          background: color,
          fontSize: 14,
        }}
      >
        <wordInner>{word}</wordInner>
      </word>
    )
  }
  static style = {
    word: {
      fontFamily: 'helvetica',
      position: 'absolute',
      padding: HL_PAD,
      // letterSpacing: -2,
      color: '#000', //'blue',
      fontWeight: 200,
      // borderRadius: 3,
      // background: [200, 200, 200, 0.15],
    },
    highlighted: {
      borderBottom: [1, 'solid', [0, 0, 0, 0.1]],
    },
    hovered: {
      background: 'rgba(0,0,0,0.1) !important',
      opacity: 1,
    },
    wordInner: {
      opacity: 0.5,
      top: -14,
      left: -4,
      position: 'absolute',
      wordWrap: 'no-wrap',
      whiteSpace: 'pre',
    },
  }
}

@view
class Words {
  render({ store, store: { ocrWords } }) {
    return (ocrWords || []).map(item => (
      <OCRWord key={getKey(item)} item={item} store={store} />
    ))
  }
}

@view
class OCRLine {
  render({ item, store }) {
    const [x, y, width, height] = item
    const key = getKey(item)
    return (
      <ocrLine
        $hoveredLine={store.lineHovered.findIndex(x => x.string === key) >= 0}
        style={{
          top: y - TOP_BAR_PAD + LINE_Y_ADJ,
          left: x,
          width: width,
          height: height, // add some padding
        }}
      />
    )
  }
  static style = {
    ocrLine: {
      borderBottom: [2, '#EDD71E'],
      position: 'absolute',
      opacity: 0.5,
    },
    hoveredLine: {
      borderBottom: [3, '#EDD71E'],
    },
  }
}

@view
class Lines {
  render({ store }) {
    return (Screen.apiState.linePositions || []).map(item => (
      <OCRLine key={getKey(item)} item={item} store={store} />
    ))
  }
}

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

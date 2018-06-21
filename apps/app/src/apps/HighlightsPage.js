import * as React from 'react'
import { view, react } from '@mcro/black'
import quadtree from 'simple-quadtree'
import { Desktop, Swift } from '@mcro/stores'
import * as Helpers from '@mcro/constants'
// import { LINE_Y_ADJ, toTarget } from './helpers'
import { OCRWord } from './highlights/ocrWord'
import { OCRLine } from './highlights/ocrLine'

// const log = debug('highlights')

@view({
  store: class HighlightsStore {
    trees = {
      word: quadtree(0, 0, window.innerWidth, window.innerHeight),
      line: quadtree(0, 0, window.innerWidth, window.innerHeight),
    }
    version = 0
    hoverEvents = {}

    get content() {
      return Desktop.activeOCRWords.map(i => i[4]).join(' ')
    }

    // setHighlightWords = react(
    //   () => this.content,
    //   () => {
    //     App.setHighlightWords(
    //       ner(this.content).reduce(
    //         (acc, item) => ({ ...acc, [item]: true }),
    //         {},
    //       ),
    //     )
    //   },
    // )

    // react({ immediate: true, log: 'state' })
    // setHovered = [
    //   () => [this.trees, Desktop.mouseState.position],
    //   ([{ word, line }, { x, y }]) => {
    //     // if (Swift.state.isPaused) return
    //     let hoveredWord = null
    //     let hoveredLine = null
    //     const gotWord = toTarget(word.get({ x, y, w: 0, h: 0 })[0])
    //     const gotLine = toTarget(
    //       line.get({ x, y: y - LINE_Y_ADJ, w: 0, h: 0 })[0],
    //     )
    //     if (gotWord) {
    //       const { key: wkey, ...wordT } = gotWord
    //       hoveredWord = { ...wordT, index: +wkey }
    //     }
    //     if (gotLine) {
    //       const { key: lkey, ...lineT } = gotLine
    //       hoveredLine = { ...lineT, index: +lkey }
    //     }
    //     App.setState({ hoveredWord, hoveredLine })
    //   },
    // ]

    // test positions - all four corners + center
    // get ocrWords() {
    //   return [
    //     [100, 60, 120, 10, 'xx', 'red'],
    //     [1500, 60, 120, 10, 'xx', 'red'],
    //     [1500, 1000, 120, 10, 'xx', 'red'],
    //     [100, 1000, 120, 10, 'xx', 'red'],
    //     [800, 500, 120, 10, 'xx', 'red'],
    //   ]
    // }

    // test inline words - three above each other
    get ocrWords() {
      return []
      // return [
      //   [200, 260, 120, 10, 'xx', 5, 'rgba(255,0,0,0.2)'],
      //   [500, 350, 200, 10, 'xx', 6, 'rgba(255,0,0,0.2)'],
      //   [300, 460, 300, 10, 'xx', 7, 'rgba(255,0,0,0.2)'],
      // ]
    }

    hoverOCRLines = react(
      () => Desktop.ocrState.lines,
      this.setupHover('line'),
      { immediate: true },
    )

    hoverOCRWords = react(
      () => this.ocrWords, //Desktop.ocrState.words,
      this.setupHover('word'),
      { immediate: true },
    )

    get showAll() {
      if (Swift.state.isPaused) {
        return true
      }
      const isTesting =
        Desktop.activeOCRWords.length && Desktop.activeOCRWords[0].length >= 6
      return (
        isTesting ||
        Desktop.state.ocrState.updatedAt > Desktop.state.lastScreenChange
      )
    }

    setupHover(name) {
      return items => {
        if (!items) return
        if (!items.length) return
        this.trees[name].clear()
        for (const item of items) {
          this.trees[name].put({
            x: item[0],
            y: item[1],
            w: item[2],
            h: item[3],
            string: `${item[5]}`,
          })
        }
      }
    }
  },
})
export class HighlightsPage {
  render({ store }) {
    return (
      <frame if={store.showAll}>
        {(store.ocrWords || []).map(item => (
          <OCRWord key={Helpers.wordKey(item)} item={item} store={store} />
        ))}
        {(Desktop.ocrState.lines || []).map(item => (
          <OCRLine key={Helpers.wordKey(item)} item={item} store={store} />
        ))}
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
      transition: 'all ease-in 200ms',
      // background: [0, 0, 0, 0.5],
    },
    overlay: {
      background: [0, 0, 0, 0.15],
    },
  }
}

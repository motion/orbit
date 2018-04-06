import * as React from 'react'
import { view, react } from '@mcro/black'
import quadtree from 'simple-quadtree'
import { Helpers, App, Desktop, Swift } from '@mcro/all'
import { LINE_Y_ADJ, toTarget } from './helpers'
import OCRWord from './ocrWord'
import OCRLine from './ocrLine'
import ner from '~/stores/language/ner'

const log = debug('highlights')

@view({
  store: class HighlightsStore {
    trees = {
      word: quadtree(0, 0, window.innerWidth, window.innerHeight),
      line: quadtree(0, 0, window.innerWidth, window.innerHeight),
    }
    version = 0
    hoverEvents = {}
    hoveredWord = null
    hoveredLine = null

    get content() {
      return Desktop.activeOCRWords.map(i => i[4]).join(' ')
    }

    @react
    setHighlightWords = [
      () => this.content,
      () => {
        App.setHighlightWords(
          ner(this.content).reduce(
            (acc, item) => ({ ...acc, [item]: true }),
            {},
          ),
        )
      },
    ]

    @react({ fireImmediately: true, log: false })
    setHovered = [
      () => [this.trees, Desktop.mouseState.position],
      ([{ word, line }, { x, y }]) => {
        // if (Swift.state.isPaused) return
        const hoveredWord = toTarget(word.get({ x, y, w: 0, h: 0 })[0])
        const hoveredLine = toTarget(
          line.get({ x, y: y - LINE_Y_ADJ, w: 0, h: 0 })[0],
        )
        this.hoveredWord = hoveredWord
        this.hoveredLine = hoveredLine
        App.setState({ hoveredWord, hoveredLine })
      },
    ]

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
      return [
        [200, 260, 120, 10, 'xx', 'rgba(255,0,0,0.5)'],
        [500, 350, 200, 10, 'xx', 'rgba(255,0,0,0.5)'],
        [300, 460, 300, 10, 'xx', 'rgba(255,0,0,0.5)'],
      ]
    }

    @react({ fireImmediately: true })
    hoverOCRLines = [() => Desktop.ocrState.lines, this.setupHover('line')]

    @react({ fireImmediately: true })
    hoverOCRWords = [
      () => this.ocrWords, //Desktop.ocrState.words,
      this.setupHover('word'),
    ]

    get showAll() {
      if (Swift.state.isPaused) {
        log('swiftPaused')
        return true
      }
      const isTesting =
        Desktop.activeOCRWords.length && Desktop.activeOCRWords[0].length === 6
      return (
        isTesting ||
        Desktop.state.ocrState.updatedAt > Desktop.state.lastScreenChange
      )
    }

    setupHover(name) {
      return items => {
        log(`setuphover`, name, items)
        if (!items) return
        if (!items.length) return
        this.trees[name].clear()
        for (const item of items) {
          this.trees[name].put({
            x: item[0],
            y: item[1],
            w: item[2],
            h: item[3],
            string: Helpers.wordKey(item),
          })
        }
      }
    }
  },
})
export default class HighlightsPage {
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
    },
  }
}

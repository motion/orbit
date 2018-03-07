import * as React from 'react'
import { view } from '@mcro/black'
import quadtree from 'simple-quadtree'
import { Helpers, App, Desktop, Swift } from '@mcro/all'
import { LINE_Y_ADJ, toTarget } from './helpers'
import OCRWord from './ocrWord'
import OCRLine from './ocrLine'
import ner from '~/stores/language/ner'
import KnowledgeStore from '~/stores/knowledgeStore'

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
    knowledge = null

    get ocrWords() {
      return (Desktop.state.ocrWords || []).filter(
        (_, index) => !Desktop.state.clearWords[index],
      )
    }

    get content() {
      return this.ocrWords.map(i => i[4]).join(' ')
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
      if (Swift.state.isPaused) {
        log('swiftPaused')
        return true
      }
      const isTesting = this.ocrWords.length && this.ocrWords[0].length === 4
      return isTesting || Desktop.state.lastOCR > Desktop.state.lastScreenChange
    }

    willMount() {
      // setup hover events
      this.knowledge = new KnowledgeStore()

      this.react(
        () => this.content,
        () => {
          App.setState({
            highlightWords: ner(this.content).reduce(
              (acc, item) => ({ ...acc, [item]: true }),
              {},
            ),
          })
        },
      )

      this.react(() => this.ocrWords, this.setupHover('word'), true)
      this.react(
        () => Desktop.state.linePositions,
        this.setupHover('line'),
        true,
      )
      // set hovered word/line
      this.react(
        () => ({
          ...this.trees,
          ...Desktop.state.mousePosition,
        }),
        function updateHovers({ word, line, x, y }) {
          if (Swift.state.isPaused) return
          const hoveredWord = toTarget(word.get({ x, y, w: 0, h: 0 })[0])
          const hoveredLine = toTarget(
            line.get({ x, y: y - LINE_Y_ADJ, w: 0, h: 0 })[0],
          )
          this.hoveredWord = hoveredWord
          this.hoveredLine = hoveredLine
          App.setState({ hoveredWord, hoveredLine })
        },
        true,
      )
    }

    setupHover = name => items => {
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
  },
})
export default class HighlightsPage {
  render({ store, store: { ocrWords } }) {
    return (
      <frame if={store.showAll}>
        {(ocrWords || []).map(item => (
          <OCRWord key={Helpers.wordKey(item)} item={item} store={store} />
        ))}
        {(Desktop.state.linePositions || []).map(item => (
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

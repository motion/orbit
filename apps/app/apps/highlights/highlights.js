import * as React from 'react'
import { view } from '@mcro/black'
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
      const isTesting =
        Desktop.activeOCRWords.length && Desktop.activeOCRWords[0].length === 4
      return (
        isTesting ||
        Desktop.state.ocrState.updatedAt > Desktop.state.lastScreenChange
      )
    }

    willMount() {
      // setup hover events

      this.react(
        () => this.content,
        () => {
          App.setHighlightWords(
            ner(this.content).reduce(
              (acc, item) => ({ ...acc, [item]: true }),
              {},
            ),
          )
        },
      )

      this.react(() => Desktop.ocrState.words, this.setupHover('word'), true)
      this.react(() => Desktop.ocrState.lines, this.setupHover('line'), true)
      // set hovered word/line
      this.react(
        () => ({
          ...this.trees,
          ...Desktop.mouseState.position,
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
  render({ store }) {
    return (
      <frame if={store.showAll}>
        {(Desktop.activeOCRWords || []).map(item => (
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

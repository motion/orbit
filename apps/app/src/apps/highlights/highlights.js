import * as React from 'react'
import { view } from '@mcro/black'
import quadtree from 'simple-quadtree'
import Screen, { desktopState, swiftState } from '@mcro/screen'
import { LINE_Y_ADJ, toTarget, getKey } from './helpers'
import OCRWord from './ocrWord'
import OCRLine from './ocrLine'
import ner from '~/stores/language/ner'
import KnowledgeStore from '~/stores/knowledgeStore'
import { includes } from 'lodash'

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
      return (desktopState.ocrWords || []).filter(
        (_, index) => !desktopState.clearWords[index],
      )
    }

    get content() {
      return this.ocrWords.map(i => i[4]).join(' ')
    }

    get entities() {
      return ner(this.content)
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
      if (swiftState.isPaused) {
        return true
      }
      const isTesting = this.ocrWords.length && this.ocrWords[0].length === 4
      return desktopState.lastOCR > desktopState.lastScreenChange
      // if (desktopState.keyboard.option) {
      // }
      return isTesting
    }

    willMount() {
      // setup hover events
      console.log('hello')
      this.knowledge = new KnowledgeStore()
      this.react(
        () => this.hoveredWord,
        () => {
          console.log('hovered is', this.hoveredWord)
          if (this.hoveredWord) {
            this.knowledge.word = this.hoveredWord
          }
        },
      )
      this.react(() => this.ocrWords, this.setupHover('word'), true)
      this.react(
        () => desktopState.linePositions,
        this.setupHover('line'),
        true,
      )
      // set hovered word/line
      this.react(
        () => ({
          ...this.trees,
          ...desktopState.mousePosition,
        }),
        function updateHovers({ word, line, x, y }) {
          if (swiftState.isPaused) return
          const hoveredWord = toTarget(word.get({ x, y, w: 0, h: 0 })[0])
          const hoveredLine = toTarget(
            line.get({ x, y: y - LINE_Y_ADJ, w: 0, h: 0 })[0],
          )
          this.hoveredWord = hoveredWord
          this.hoveredLine = hoveredLine
          Screen.setState({ hoveredWord, hoveredLine })
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
          string: getKey(item),
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
          <OCRWord
            key={getKey(item)}
            highlighted={includes(store.entities, item[4])}
            item={item}
            store={store}
          />
        ))}
        {(desktopState.linePositions || []).map(item => (
          <OCRLine key={getKey(item)} item={item} store={store} />
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

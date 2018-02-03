// @flow
import * as React from 'react'
import { view } from '@mcro/black'
import * as Helpers from '~/helpers'
import quadtree from 'simple-quadtree'

const HL_PAD = 2
const TOP_BAR_PAD = 22

class HighlightsStore {
  tree = quadtree(0, 0, window.innerWidth, window.innerHeight + 23)
  version = 0
  electronState = {}
  hoverEvents = {}

  get context() {
    return this.props.contextStore
  }

  // get ocrWords() {
  //   return (this.context.ocrWords || []).filter(
  //     (_, index) => !this.context.clearWords[index],
  //   )
  // }

  get hovered() {
    const [x, y] = this.context.mousePosition || []
    const res = (this.tree && this.tree.get({ x, y, w: 0, h: 0 })) || []
    return res
  }

  // test words
  get ocrWords() {
    return [
      [100, 60, 120, 10, 'xx', 'red'],
      [1500, 60, 120, 10, 'xx', 'red'],
      [1500, 1000, 120, 10, 'xx', 'red'],
      [100, 1000, 120, 10, 'xx', 'red'],
      [800, 500, 120, 10, 'xx', 'red'],
    ]
  }

  get showAll() {
    return true || this.context.lastOCR > this.context.lastScreenChange
      ? true
      : false
  }

  willMount() {
    // start context watching
    this.props.contextStore.start()
    this.setupHoverEvents()
  }

  getHoverProps = Helpers.hoverSettler({
    enterDelay: 600,
    onHovered: object => {
      console.log('peek', object)
      Helpers.OS.send('peek-target', object)
    },
  })

  setupHoverEvents = () => {
    this.react(
      () =>
        [...(this.ocrWords || []), ...(this.context.linePositions || [])] || [],
      function newPositions(items) {
        this.tree.clear()
        this.hoverEvents = items.reduce((acc, item) => {
          const key = this.getKey(item)
          // side effect
          this.tree.put({
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
      },
      true,
    )
  }

  getKey = ([x, y, w, h]) => `${x}${y}${w}${h}`
}

@view.attach('contextStore')
@view({
  store: HighlightsStore,
})
export default class HighlightsPage {
  render({ store }) {
    const { showAll, context, ocrWords, hovered } = store
    return (
      <frame if={showAll}>
        {(ocrWords || []).map(item => {
          const [x, y, width, height, word, color] = item
          const key = store.getKey(item)
          return (
            <word
              key={key}
              $hovered={hovered.findIndex(x => x.string === key) >= 0}
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
              $hoveredLine={hovered.findIndex(x => x.string === key) >= 0}
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

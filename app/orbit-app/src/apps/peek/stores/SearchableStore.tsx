import * as React from 'react'
import { App } from '@mcro/stores'
import { ensure, react } from '@mcro/black'
import { Actions } from '../../../actions/Actions'

export class SearchableStore {
  contentFrame = React.createRef<HTMLDivElement>()

  get highlights(): HTMLDivElement[] {
    // this.state // update on state...?
    return Array.from(this.contentFrame.current.querySelectorAll('.highlight'))
  }

  scrollToHighlight = react(
    () => App.peekState.highlightIndex,
    async (index, { sleep }) => {
      ensure('index number', index === 'number')
      const frame = this.contentFrame.current
      ensure('has frame', !!frame)
      await sleep(150)
      const activeHighlight = this.highlights[index]
      ensure('active highlight', !!activeHighlight)
      // move frame to center the highlight but 100px more towards the top which looks nicer
      frame.scrollTop = activeHighlight.offsetTop - frame.clientHeight / 2 + 100
    },
  )

  goToNextHighlight = () => {
    const { highlightIndex } = App.peekState
    // loop back to beginning once at end
    const next = (highlightIndex + 1) % this.highlights.length
    Actions.setHighlightIndex(next)
  }
}

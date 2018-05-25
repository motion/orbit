import * as React from 'react'
import { view, sleep } from '@mcro/black'
import { HomePlayChats } from './HomePlayChats'
import { HomePlayMessages } from './HomePlayMessages'
import { HomePlayDock } from './HomePlayDock'

class HomePlayStore {
  animate = false
  async willMount() {
    await sleep(250)
    this.animate = true
  }
}

@view({
  store: HomePlayStore,
})
export class HomePlay extends React.Component {
  render({ store }) {
    return (
      <>
        <illus>
          <HomePlayDock animate={store.animate} />
          <HomePlayChats animate={store.animate} />
        </illus>
        <HomePlayMessages animate={store.animate} />
      </>
    )
  }

  static style = {
    illus: {
      position: 'relative',
      height: '100%',
      width: '90%',
      margin: 'auto',
      overflow: 'hidden',
      zIndex: 0,
    },
  }
}

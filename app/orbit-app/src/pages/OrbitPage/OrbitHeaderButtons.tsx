import * as React from 'react'
import { view, attach } from '@mcro/black'
import { ThemeObject } from '@mcro/gloss'
import { memoize } from 'lodash'
import { ClearButton, Icon } from '@mcro/ui'
import { QueryStore } from '../../stores/QueryStore/QueryStore'
import { PaneManagerStore } from '../../stores/PaneManagerStore'

const Section = view('section', {
  width: '100%',
  flexFlow: 'row',
  padding: [0, 6],
  alignItems: 'center',
  transition: 'all ease 500ms',
  transform: {
    y: -0.5,
  },
  invisible: {
    opacity: 0,
    pointerEvents: 'none',
  },
})

type Props = {
  queryStore?: QueryStore
  paneManagerStore?: PaneManagerStore
  theme?: ThemeObject
}

const Interactive = view({
  flexFlow: 'row',
  alignItems: 'center',
  opacity: 0,
  pointerEvents: 'none',
  enabled: {
    opacity: 1,
    pointerEvents: 'inherit',
  },
})

@attach('queryStore', 'paneManagerStore')
@view
export class OrbitHeaderButtons extends React.Component<Props> {
  paneSetter = memoize(name => () => {
    this.props.paneManagerStore.setActivePane(name)
  })

  clearSearch = () => {
    this.props.queryStore.clearQuery()
  }

  render() {
    const { paneManagerStore, queryStore } = this.props
    return (
      <>
        <Section invisible={paneManagerStore.activePane === 'onboard'}>
          <Interactive enabled={paneManagerStore.activePane === 'settings' || queryStore.hasQuery}>
            <ClearButton
              onClick={
                paneManagerStore.activePane === 'settings'
                  ? paneManagerStore.setActivePaneToPrevious
                  : this.clearSearch
              }
            >
              <Icon name="arrow-min-left" size={8} opacity={0.8} margin="auto" />
            </ClearButton>
          </Interactive>
        </Section>
      </>
    )
  }
}

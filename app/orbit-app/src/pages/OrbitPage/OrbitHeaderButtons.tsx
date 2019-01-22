import { gloss } from '@mcro/gloss'
import { ClearButton, Icon } from '@mcro/ui'
import { observer } from 'mobx-react-lite'
import * as React from 'react'
import { useStoresSafe } from '../../hooks/useStoresSafe'

const Section = gloss('section', {
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

const Interactive = gloss({
  flexFlow: 'row',
  alignItems: 'center',
  opacity: 0,
  pointerEvents: 'none',
  enabled: {
    opacity: 1,
    pointerEvents: 'inherit',
  },
})

export default observer(function OrbitHeaderButtons() {
  const { paneManagerStore, queryStore } = useStoresSafe()

  const clearSearch = () => {
    queryStore.clearQuery()
  }

  return (
    <>
      <Section invisible={paneManagerStore.activePane.type === 'onboard'}>
        <Interactive
          enabled={paneManagerStore.activePane.type === 'settings' || queryStore.hasQuery}
        >
          <ClearButton
            onClick={
              paneManagerStore.activePane.type === 'settings'
                ? paneManagerStore.setActivePaneToPrevious
                : clearSearch
            }
          >
            <Icon name="arrow-min-left" size={8} opacity={0.8} margin="auto" />
          </ClearButton>
        </Interactive>
      </Section>
    </>
  )
})

import * as React from 'react'
import { gloss } from '@mcro/gloss'
import { ClearButton, Icon } from '@mcro/ui'
import { useStoresSafe } from '../../hooks/useStoresSafe'
import { observer } from 'mobx-react-lite'

const Section = gloss('section', {
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

export const OrbitHeaderButtons = observer(() => {
  const { paneManagerStore, queryStore } = useStoresSafe()

  // const paneSetter = memoize(name => () => {
  //   paneManagerStore.setActivePane(name)
  // })
  const clearSearch = () => {
    queryStore.clearQuery()
  }

  return (
    <>
      <Section invisible={paneManagerStore.activePane === 'onboard'}>
        <Interactive enabled={paneManagerStore.activePane === 'settings' || queryStore.hasQuery}>
          <ClearButton
            onClick={
              paneManagerStore.activePane === 'settings'
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

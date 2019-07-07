import { ClearButton, Icon } from '@o/ui'
import { Box, gloss } from 'gloss'
import * as React from 'react'

import { useStores } from '../../hooks/useStores'
import { useOm } from '../../om/om'

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

const Interactive = gloss<{ enabled?: boolean }>(Box, {
  flexFlow: 'row',
  alignItems: 'center',
  opacity: 0,
  pointerEvents: 'none',
  enabled: {
    opacity: 1,
    pointerEvents: 'inherit',
  },
})

export default function OrbitHeaderButtons() {
  const om = useOm()
  const appId = om.state.router.appId
  const { queryStore } = useStores()

  const clearSearch = () => {
    queryStore.clearQuery()
  }

  return (
    <>
      <Section invisible={appId === 'onboard'}>
        <Interactive enabled={appId === 'settings' || queryStore.hasQuery}>
          <ClearButton onClick={appId === 'settings' ? om.actions.router.back : clearSearch}>
            <Icon name="arrow-min-left" size={8} opacity={0.8} margin="auto" />
          </ClearButton>
        </Interactive>
      </Section>
    </>
  )
}

import { AppType } from '@mcro/models'
import { Absolute, Text, Theme } from '@mcro/ui'
import { observer } from 'mobx-react-lite'
import * as React from 'react'
import { useStoresSafe } from '../../hooks/useStoresSafe'
import { RoundButton, Title } from '../../views'
import { Section } from '../../views/Section'
import { AppProps } from '../AppProps'

export default observer(function SettingsAppSpaces(_: AppProps<AppType.settings>) {
  const stores = useStoresSafe()
  const { activeSpace, inactiveSpaces } = stores.spaceStore

  return (
    <Section sizePadding={2}>
      <Title>Spaces</Title>

      <Text size={1.2}>
        Spaces are the high level way you can organize your content. Use the orb to the left of the
        search bar to switch between spaces. 123
      </Text>

      {JSON.stringify(activeSpace)}
      {JSON.stringify(inactiveSpaces)}
      <Absolute bottom={10} right={10}>
        <Theme name="selected">
          <RoundButton
            elevation={1}
            size={1.8}
            sizeIcon={0.6}
            circular
            icon="add"
            tooltip="Create new app"
          />
        </Theme>
      </Absolute>
    </Section>
  )
})

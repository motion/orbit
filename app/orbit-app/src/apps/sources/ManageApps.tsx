import { AppIcon } from '@mcro/kit'
import { AppBit } from '@mcro/models'
import { BorderLeft, Row, SelectableList, SubTitle, Title, View } from '@mcro/ui'
import React, { useState } from 'react'
import { useActiveApps } from '../../hooks/useActiveApps'
import { Section, SectionTitle } from '../../views/Section'
import VerticalSplitPane from '../../views/VerticalSplitPane'
import { AppView } from '../AppView'

export const ManageApps = function ManageApps() {
  const apps = useActiveApps() as AppBit[]
  const [index, setIndex] = useState(0)
  const selectedApp = apps[index]

  if (!selectedApp) {
    return null
  }

  return (
    <>
      <Row flex={1}>
        <View width="50%">
          <SectionTitle>Apps</SectionTitle>
          <SelectableList
            dynamicHeight
            maxHeight={400}
            createNewSelectionStore
            minSelected={0}
            items={apps.map(app => ({
              title: app.name,
              icon: <AppIcon app={app} />,
              type: app.type,
              iconBefore: true,
            }))}
            onSelect={i => setIndex(i)}
          />
        </View>

        <VerticalSplitPane>
          <BorderLeft />
          <Section>
            <SubTitle>Settings</SubTitle>
            <Title>{selectedApp.name}</Title>
            <AppView type={selectedApp.type} viewType="settings" />
          </Section>
        </VerticalSplitPane>
      </Row>
    </>
  )
}

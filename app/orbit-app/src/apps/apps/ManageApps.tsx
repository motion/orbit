import { AppIcon, AppView, useActiveApps } from '@mcro/kit'
import {
  BorderLeft,
  Row,
  Section,
  SectionTitle,
  SelectableList,
  SubTitle,
  Title,
  VerticalSplitPane,
  View,
} from '@mcro/ui'
import React, { useState } from 'react'

export const ManageApps = function ManageApps() {
  const apps = useActiveApps()
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
              identifier: app.identifier,
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
            <AppView identifier={selectedApp.identifier} viewType="settings" />
          </Section>
        </VerticalSplitPane>
      </Row>
    </>
  )
}

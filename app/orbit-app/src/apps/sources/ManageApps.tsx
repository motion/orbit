import { App, AppType } from '@mcro/models'
import { Row, View } from '@mcro/ui'
import React, { useState } from 'react'
import { useActiveApps } from '../../hooks/useActiveApps'
import { AppIcon } from '../../views/AppIcon'
import { BorderTop } from '../../views/Border'
import SelectableList from '../../views/Lists/SelectableList'
import { Section, SectionTitle } from '../../views/Section'
import VerticalSplitPane from '../../views/VerticalSplitPane'
import { AppView } from '../AppView'
import PreviewApp from '../views/PreviewApp'

export const ManageApps = function ManageApps() {
  const apps = useActiveApps() as App[]
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
              type: AppType[app.type],
              iconBefore: true,
            }))}
            onSelect={setIndex}
          />

          <Section>
            <BorderTop />
            <AppView type={selectedApp.type} viewType="settings" />
          </Section>
        </View>

        <VerticalSplitPane>
          <PreviewApp app={selectedApp} />
        </VerticalSplitPane>
      </Row>
    </>
  )
}

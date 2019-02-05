import { AppType } from '@mcro/models'
import { Row, View } from '@mcro/ui'
import React, { useState } from 'react'
import { useActiveApps } from '../../hooks/useActiveApps'
import { Title } from '../../views'
import { AppIcon } from '../../views/AppIcon'
import SelectableList from '../../views/Lists/SelectableList'
import { Section } from '../../views/Section'
import VerticalSplitPane from '../../views/VerticalSplitPane'
import PreviewApp from '../views/PreviewApp'

export const ManageApps = function ManageApps() {
  const apps = useActiveApps()
  const [index, setIndex] = useState(0)
  const selectedApp = apps[index]

  if (!selectedApp) {
    return null
  }

  return (
    <Row flex={1}>
      <View width="50%">
        <Section paddingBottom={0}>
          <Title>Apps</Title>
        </Section>
        <SelectableList
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
      </View>

      <VerticalSplitPane>
        <PreviewApp app={selectedApp} />
      </VerticalSplitPane>
    </Row>
  )
}

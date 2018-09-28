import { Row, Sidebar, SidebarLabel, Col, Theme, Tabs, Tab } from '@mcro/ui'
import * as React from 'react'
import { SimpleItem } from '../../../../../views/SimpleItem'

export class AppTopicExplorer extends React.Component {
  render() {
    return (
      <Row flex={1}>
        <Sidebar minWidth={150} maxWidth={300} width={200} position="left">
          <SidebarLabel>Recent topics</SidebarLabel>
          <SimpleItem title="Slack" icon="slack" />
          <SimpleItem title="Github" icon="github" />
          <SimpleItem title="Jira" icon="jira" />
        </Sidebar>
        <Col flex={1}>
          <Theme select={theme => theme.titleBar || theme}>
            <Tabs active="first">
              <Tab key="first" width="50%" label="First Tab" />
              <Tab key="second" width="50%" label="Second Tab" />
            </Tabs>
          </Theme>

          <Col flex={1} alignItems="center" justifyContent="center" />
        </Col>
      </Row>
    )
  }
}

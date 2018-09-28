import { Row, Sidebar, SidebarLabel, Col, Theme, Tabs, Tab } from '@mcro/ui'
import * as React from 'react'
import { SimpleItem } from '../../../../../views/SimpleItem'
import { view } from '@mcro/black'
import { loadMany } from '@mcro/model-bridge'
import { SearchTopicsModel, Setting } from '@mcro/models'

type Props = { setting: Setting }

class AppTopicStore {
  props: Props
  topics = null

  async didMount() {
    this.topics = await loadMany(SearchTopicsModel, {
      args: {
        query: {
          query: '',
          integrationFilters: [this.props.setting.type],
          take: 500,
          skip: 0,
        },
        count: 20,
      },
    })
  }
}

@view.attach({
  store: AppTopicStore,
})
@view
export class AppTopicExplorer extends React.Component<Props & { store?: AppTopicStore }> {
  render() {
    const { store } = this.props
    return (
      <Row flex={1}>
        <Sidebar minWidth={150} maxWidth={300} width={200} position="left">
          <SidebarLabel>Recent topics</SidebarLabel>
          {JSON.stringify(store.topics)}
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

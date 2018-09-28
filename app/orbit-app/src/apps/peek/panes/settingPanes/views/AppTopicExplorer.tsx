import { Row, Sidebar, SidebarLabel, Col, Theme, Tabs, Tab } from '@mcro/ui'
import * as React from 'react'
import { SimpleItem } from '../../../../../views/SimpleItem'
import { view } from '@mcro/black'
import { loadMany } from '@mcro/model-bridge'
import { SearchTopicsModel, Setting, SearchLocationsModel, SearchQuery } from '@mcro/models'

type Props = { setting: Setting }

class AppTopicStore {
  props: Props
  topics = []
  locations = []
  private searchArgs = {
    query: {
      query: '',
      integrationFilters: [this.props.setting.type],
      take: 1000,
      skip: 0,
      sortBy: 'Recent',
    } as SearchQuery,
    count: 20,
  }

  async didMount() {
    this.loadTopics()
    this.loadLocations()
  }

  async loadTopics() {
    this.topics = await loadMany(SearchTopicsModel, {
      args: this.searchArgs,
    })
  }

  async loadLocations() {
    this.locations = await loadMany(SearchLocationsModel, {
      args: this.searchArgs,
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
          <SidebarLabel>Topics</SidebarLabel>
          {store.topics.map((topic, i) => (
            <SimpleItem key={i} title={topic} />
          ))}
        </Sidebar>
        <Col overflow="hidden" flex={1}>
          <Theme select={theme => theme.titleBar || theme}>
            <Tabs active="first">
              {store.locations.map((location, i) => (
                <Tab key={i} width={140} label={location} />
              ))}
            </Tabs>
          </Theme>

          <Col flex={1} alignItems="center" justifyContent="center" />
        </Col>
      </Row>
    )
  }
}

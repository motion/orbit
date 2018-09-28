import { Row, Sidebar, SidebarLabel, Col, Theme, Tabs, Tab } from '@mcro/ui'
import * as React from 'react'
import { SimpleItem } from '../../../../../views/SimpleItem'
import { view } from '@mcro/black'
import { loadMany } from '@mcro/model-bridge'
import { SearchTopicsModel, Setting, SearchLocationsModel, SearchQuery } from '@mcro/models'

type Props = { setting: Setting }

class AppTopicStore {
  props: Props
  activeTab = null
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
    this.activeTab = this.locations[0] || ''
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
          <SidebarLabel>Locations</SidebarLabel>
          {store.locations.map((location, i) => (
            <SimpleItem key={i} title={location} />
          ))}
        </Sidebar>
        <Col overflow="hidden" flex={1}>
          <Tabs active={store.activeTab} onActive={x => (store.activeTab = x)}>
            {store.topics.map((topic, i) => (
              <Tab key={topic} width={140} label={topic} />
            ))}
          </Tabs>

          <Col flex={1} alignItems="center" justifyContent="center" />
        </Col>
      </Row>
    )
  }
}

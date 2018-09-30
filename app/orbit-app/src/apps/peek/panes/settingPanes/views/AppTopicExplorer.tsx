import { Row, Sidebar, SidebarLabel, Col, Tabs, Tab, View } from '@mcro/ui'
import * as React from 'react'
import { SimpleItem } from '../../../../../views/SimpleItem'
import { view, react, ensure } from '@mcro/black'
import { loadMany } from '@mcro/model-bridge'
import {
  SearchTopicsModel,
  Setting,
  SearchLocationsModel,
  SearchQuery,
  SearchResultModel,
} from '@mcro/models'
import { OrbitListItem } from '../../../../../views/OrbitListItem'
import produce from 'immer'

type Props = { setting: Setting }

class AppTopicStore {
  props: Props
  activeTopic = ''
  activeLocation = ''
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
    this.loadLocations()
  }

  async loadLocations() {
    this.locations = await loadMany(SearchLocationsModel, {
      args: this.searchArgs,
    })
    this.activeLocation = this.locations[0]
  }

  currentItems = react(
    () => [this.activeLocation, this.activeTopic],
    async ([location, topic], { setValue }) => {
      setValue(null)
      ensure('active topic', !!this.activeTopic)
      const res = await loadMany(SearchResultModel, {
        args: {
          query: topic,
          locationFilters: [location],
          integrationFilters: [this.props.setting.type],
          skip: 0,
          take: 20,
          sortBy: 'Topic',
        },
      })
      console.log('loading...', res)
      return res
    },
  )

  topics = react(
    () => this.activeLocation,
    async location => {
      const topics = await loadMany(SearchTopicsModel, {
        args: produce(this.searchArgs, args => {
          args.query.take = 300
          args.query.locationFilters = [location]
        }),
      })
      this.activeTopic = topics[0] || ''
      return topics
    },
    {
      defaultValue: [],
    },
  )
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
            <SimpleItem
              key={i}
              title={location}
              active={location === store.activeLocation}
              onClick={() => (store.activeLocation = location)}
            />
          ))}
        </Sidebar>
        <Col overflow="hidden" flex={1}>
          <Tabs active={store.activeTopic} onActive={x => (store.activeTopic = x)}>
            {store.topics.map(topic => (
              <Tab key={topic} width={140} label={topic} />
            ))}
          </Tabs>

          {!store.currentItems && (
            <View alignItems="center" justifyContent="center">
              Loading...
            </View>
          )}

          <View overflowY="auto" flex={1}>
            {(store.currentItems || []).map(item => (
              <OrbitListItem
                key={item.id}
                model={item}
                margin={0}
                padding={15}
                isExpanded
                theme={{
                  backgroundHover: 'transparent',
                }}
              >
                {({ content }) => content}
              </OrbitListItem>
            ))}
          </View>
        </Col>
      </Row>
    )
  }
}

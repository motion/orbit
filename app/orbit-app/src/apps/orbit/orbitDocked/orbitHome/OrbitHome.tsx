import * as React from 'react'
import { view, react, ensure } from '@mcro/black'
import { observeMany } from '@mcro/model-bridge'
import { SubPane } from '../../SubPane'
import { PaneManagerStore } from '../../PaneManagerStore'
import { SelectionStore, SelectionGroup } from '../SelectionStore'
import { View, Row, SegmentedRow, Popover } from '@mcro/ui'
import { BitModel, PersonBitModel } from '@mcro/models'
import { OrbitCarouselSection } from './OrbitCarouselSection'
import { AppsStore } from '../../../AppsStore'
import { SyncStatusAll } from '../views/SyncStatusAll'
import { OrbitCard } from '../../../../views/OrbitCard'
import { SubTitle } from '../../../../views/SubTitle'
import { OrbitAppIconCard } from '../views/OrbitAppIconCard'
import { Centered } from '../../../../views/Centered'
import { OrbitMasonry } from '../../../../views/OrbitMasonry'
import { flatten } from 'lodash'
import { Unpad } from '../../../../views/Unpad'
import { VerticalSpace, Title } from '../../../../views'
import { NavButton } from '../../../../views/NavButton'
import { DateRangePicker } from 'react-date-range'
import { SearchStore } from '../SearchStore'

// import { OrbitSuggestionBar } from '../orbitHeader/OrbitSuggestionBar'
// <OrbitSuggestionBar
// paneManagerStore={paneManagerStore}
// filterStore={searchStore.searchFilterStore}
// />

type Props = {
  name: string
  searchStore?: SearchStore
  paneManagerStore?: PaneManagerStore
  selectionStore?: SelectionStore
  homeStore?: OrbitHomeStore
  appsStore?: AppsStore
}

const findManyType = integration => ({
  take: 10,
  where: {
    integration,
  },
  relations: ['people'],
  order: { bitCreatedAt: 'DESC' },
})

const allStreams = [
  // {
  //   id: '-1',
  //   name: 'Apps',
  //   source: 'apps',
  //   showTitle: false,
  //   model: SettingModel,
  //   query: {
  //     where: {
  //       category: 'integration',
  //     },
  //     take: 1000,
  //   },
  // },
  {
    id: '0',
    name: 'People',
    source: 'people',
    model: PersonBitModel,
    query: {
      take: 20,
    },
  },
  {
    id: '1',
    name: 'Slack',
    source: 'slack',
    model: BitModel,
    query: findManyType('slack'),
  },
  {
    id: '2',
    name: 'Gmail',
    source: 'gmail',
    model: BitModel,
    query: findManyType('gmail'),
  },
  {
    id: '3',
    name: 'Google Drive',
    source: 'gdrive',
    model: BitModel,
    query: findManyType('gdrive'),
  },
  {
    id: '4',
    name: 'Github',
    source: 'github',
    model: BitModel,
    query: findManyType('github'),
  },
  {
    id: '5',
    name: 'Confluence',
    source: 'confluence',
    model: BitModel,
    query: findManyType('confluence'),
  },
  {
    id: '6',
    source: 'jira',
    name: 'Jira',
    model: BitModel,
    query: findManyType('jira'),
  },
  // {
  //   id: '7',
  //   source: 'app1',
  //   name: 'Test App',
  //   model: BitModel,
  //   query: findManyType('app1'),
  // },
].filter(Boolean)

class OrbitHomeStore {
  props: Props

  willUnmount() {
    if (this.state) {
      this.state.dispose()
    }
  }

  get isActive() {
    return this.props.paneManagerStore.activePane === this.props.name
  }

  setSelectionHandler = react(
    () => [this.isActive, this.results],
    ([isActive]) => {
      ensure('is active', !!isActive)
      this.props.selectionStore.setResults(this.results)
    },
  )

  results = react(
    () => [this.streams, this.sortOrder],
    async ([streams, order], { sleep }) => {
      // avoid doing it to much during rapid initial updates...
      await sleep(150)
      let results: SelectionGroup[] = []
      let offset = 0
      for (const id of order) {
        if (!streams[id] || streams[id].values.length === 0) {
          continue
        }
        const { values, name } = streams[id]
        results.push({
          name,
          type: 'row',
          items: values,
          startIndex: offset,
          id,
        })
        offset += values.length
      }
      return results
    },
    {
      defaultValue: [],
    },
  )

  sortOrder = [0, 1, 2, 3, 4, 5, 6]

  reorder = (startIndex, endIndex) => {
    const order = [...this.sortOrder]
    const [removed] = order.splice(startIndex, 1)
    order.splice(endIndex, 0, removed)
    this.sortOrder = order
  }

  streams: { [a: string]: { values: any[]; name: string } } = {}

  state = react(
    () => this.props.appsStore.appsList,
    appsList => {
      // dispose on re-run
      if (this.state) {
        this.state.dispose()
      }
      const disposers = []
      // get active streams
      const activeStreams = allStreams.filter(
        x =>
          x.source === 'apps' ||
          x.source === 'people' ||
          x.source === 'app1' ||
          !!appsList.find(app => x.source === app.type),
      )
      // reset sort orders
      this.sortOrder = activeStreams.map(({ id }) => +id)
      // setup stream subscriptions
      for (const { id, name, model, query } of activeStreams) {
        const subscription = observeMany(model, {
          args: query,
        }).subscribe(values => {
          this.streams = {
            ...this.streams,
            [id]: { values, name },
          }
        })
        disposers.push(() => subscription.unsubscribe())
      }
      return {
        dispose: () => disposers.map(x => x()),
      }
    },
  )
}

@view.attach('searchStore', 'selectionStore', 'paneManagerStore', 'appsStore')
@view.attach({
  homeStore: OrbitHomeStore,
})
@view
export class OrbitHome extends React.Component<Props> {
  span2 = {
    gridColumnEnd: 'span 2',
  }

  onDragEnd = result => {
    // dropped outside the list
    if (!result.destination) {
      return
    }
    this.props.homeStore.reorder(result.source.index, result.destination.index)
  }

  renderApps({ name, items, startIndex }: SelectionGroup) {
    const { homeStore } = this.props
    return (
      <OrbitCarouselSection
        startIndex={startIndex}
        items={items}
        homeStore={homeStore}
        categoryName={name === 'Apps' ? null : name}
        cardHeight={45}
        cardWidth={45}
        margin={[0, 0, -5]}
        CardView={OrbitAppIconCard}
        cardProps={{
          hideTitle: true,
        }}
      />
    )
  }

  render() {
    console.log('OrbitHome Render')
    const { homeStore, paneManagerStore, searchStore } = this.props
    const { results } = homeStore
    let content
    const nav = (
      <Row position="relative" alignItems="center" padding={[3, 10]}>
        <Popover
          openOnClick
          openOnHover
          closeOnEsc
          target={<NavButton icon="clock">Today</NavButton>}
          adjust={[180, 0]}
          borderRadius={3}
        >
          <View width={440} height={300} className="calendar-dom" padding={10}>
            <DateRangePicker
              onChange={searchStore.searchFilterStore.onChangeDate}
              ranges={[searchStore.searchFilterStore.dateState]}
            />
          </View>
        </Popover>
        <Centered>
          <SegmentedRow>
            <NavButton
              onClick={paneManagerStore.activePaneSetter('home')}
              active={paneManagerStore.activePane === 'home'}
              icon="clock"
              tooltip="Recent"
            />
            <NavButton
              onClick={paneManagerStore.activePaneSetter('favorites')}
              active={paneManagerStore.activePane === 'favorites'}
              icon="favourite"
              tooltip="Favorite"
            />
            <NavButton
              onClick={paneManagerStore.activePaneSetter('topics')}
              active={paneManagerStore.activePane === 'topics'}
              icon="menu35"
              tooltip="Topics"
            />
          </SegmentedRow>
        </Centered>
        <View flex={1} />
        <SegmentedRow>
          <NavButton icon="funnel" />
          <NavButton>All</NavButton>
        </SegmentedRow>
      </Row>
    )
    const before = (
      <>
        {nav}
        <VerticalSpace />
      </>
    )
    if (results.length) {
      return (
        <>
          <SubPane name="home" fadeBottom before={before}>
            <Unpad>
              <OrbitMasonry
                items={flatten(results.map(res => res.items)).map((item, index) => (
                  <OrbitCard
                    key={index}
                    model={item}
                    index={index}
                    inGrid
                    style={index % 2 === 0 ? { marginLeft: 8 } : { marginRight: 8 }}
                  />
                ))}
              />
            </Unpad>
            <VerticalSpace />
          </SubPane>
          <SubPane name="favorites" fadeBottom before={before}>
            <Title>Favorites</Title>
          </SubPane>
          <SubPane name="topics" fadeBottom before={before}>
            <Title>Topics</Title>
          </SubPane>
        </>
      )

      // content = (
      //   <DragDropContext onDragEnd={this.onDragEnd}>
      //     <Droppable droppableId="droppable">
      //       {(provided, snapshot) => {
      //         return (
      //           <div ref={provided.innerRef} style={getListStyle(snapshot.isDraggingOver)}>
      //             {results.map(({ id, name, items, startIndex }, index) => {
      //               if (name === 'Apps') {
      //                 return null
      //               }
      //               const height = name === 'People' ? 60 : 80
      //               const width = 180
      //               return (
      //                 <Draggable key={id} draggableId={id} index={index}>
      //                   {(provided, snapshot) => {
      //                     return (
      //                       <div
      //                         ref={provided.innerRef}
      //                         {...provided.draggableProps}
      //                         {...provided.dragHandleProps}
      //                         style={getItemStyle(
      //                           snapshot.isDragging,
      //                           provided.draggableProps.style,
      //                         )}
      //                       >
      //                         <OrbitCarouselSection
      //                           startIndex={startIndex}
      //                           items={items}
      //                           homeStore={homeStore}
      //                           categoryName={name === 'Apps' ? null : name}
      //                           cardHeight={height}
      //                           cardWidth={width}
      //                           CardView={OrbitCard}
      //                         />
      //                       </div>
      //                     )
      //                   }}
      //                 </Draggable>
      //               )
      //             })}
      //             {provided.placeholder}
      //           </div>
      //         )
      //       }}
      //     </Droppable>
      //   </DragDropContext>
      // )
    } else {
      // show sync status when empty
      content = <SyncStatusAll />
    }

    return (
      <SubPane name="home" fadeBottom>
        {nav}
        {content}
        {results.length === 1 && (
          <View alignItems="center" justifyContent="center" padding={[15, 25, 0]}>
            <SubTitle>Sync is running, no bits yet!</SubTitle>
          </View>
        )}
        {/* this is a nice lip effect */}
        <View height={18} />
      </SubPane>
    )
  }
}

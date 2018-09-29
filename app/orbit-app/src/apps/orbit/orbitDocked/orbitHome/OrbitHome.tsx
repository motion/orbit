import * as React from 'react'
import { view, react, ensure } from '@mcro/black'
import { observeMany } from '@mcro/model-bridge'
import { SubPane } from '../../SubPane'
import { PaneManagerStore } from '../../PaneManagerStore'
import { SelectionStore, SelectionGroup } from '../SelectionStore'
import { View } from '@mcro/ui'
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd'
import { BitModel, PersonBitModel, SettingModel } from '@mcro/models'
import { OrbitCarouselSection } from './OrbitCarouselSection'
import { AppsStore } from '../../../AppsStore'
import { SyncStatusAll } from '../views/SyncStatusAll'
import { OrbitCard } from '../../../../views/OrbitCard'
import { OrbitAppCard } from '../orbitApps/OrbitAppCard'
// import { OrbitGridSection } from './OrbitGridSection'

type Props = {
  name: string
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
  {
    id: '-1',
    name: 'Apps',
    source: 'apps',
    model: SettingModel,
    query: {
      where: {
        category: 'integration',
      },
      take: 1000,
    },
  },
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
  {
    id: '7',
    source: 'app1',
    name: 'Test App',
    model: BitModel,
    query: findManyType('app1'),
  },
].filter(Boolean)

const getListStyle = isDraggingOver => ({
  background: isDraggingOver ? 'transparent' : 'transparent',
})

const getItemStyle = (isDragging, { left, top, ...draggableStyle }) => ({
  cursor: 'default',
  // some basic styles to make the items look a bit nicer
  userSelect: 'none',
  // change background colour if dragging
  background: isDragging ? 'transparent' : 'transparent',
  // styles we need to apply on draggables
  ...draggableStyle,
  top,
  // top: index > 0 ? top - 90 : 0,
})

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
    ([streams, order]) => {
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

  sortOrder = [0, 1, 2, 3, 4, 5, 6, 7]

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

  render() {
    console.log('OrbitHome Render')
    const { homeStore } = this.props
    const { results } = homeStore
    let content
    if (results.length) {
      content = (
        <DragDropContext onDragEnd={this.onDragEnd}>
          <Droppable droppableId="droppable">
            {(provided, snapshot) => {
              return (
                <div ref={provided.innerRef} style={getListStyle(snapshot.isDraggingOver)}>
                  {/* <SuggestionBarVerticalPad /> */}
                  {results.map(({ id, name, items, startIndex }, index) => {
                    const height = name === 'People' ? 60 : name === 'Apps' ? 80 : 90
                    const width = name === 'Apps' ? 120 : 180
                    return (
                      <Draggable key={id} draggableId={id} index={index}>
                        {(provided, snapshot) => {
                          return (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              style={getItemStyle(
                                snapshot.isDragging,
                                provided.draggableProps.style,
                              )}
                            >
                              <OrbitCarouselSection
                                startIndex={startIndex}
                                items={items}
                                homeStore={homeStore}
                                categoryName={name}
                                cardHeight={height}
                                cardWidth={width}
                                CardView={items[0].target === 'setting' ? OrbitAppCard : OrbitCard}
                              />
                            </div>
                          )
                        }}
                      </Draggable>
                    )
                  })}
                  {provided.placeholder}
                </div>
              )
            }}
          </Droppable>
        </DragDropContext>
      )
    } else {
      // show sync status when empty
      content = <SyncStatusAll />
    }
    return (
      <SubPane name="home" fadeBottom>
        {content}
        {/* this is a nice lip effect */}
        <View height={15} />
      </SubPane>
    )
  }
}

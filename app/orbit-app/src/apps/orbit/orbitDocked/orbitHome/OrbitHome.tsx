import * as React from 'react'
import { view, react, ensure } from '@mcro/black'
import { observeMany } from '../../../../repositories'
import { SubPane } from '../../SubPane'
import { PaneManagerStore } from '../../PaneManagerStore'
import {
  SelectionStore,
  SelectionGroup,
} from '../../../../stores/SelectionStore'
import { View } from '@mcro/ui'
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd'
import { BitModel, PersonBitModel } from '@mcro/models'
import { OrbitCarouselSection } from './OrbitCarouselSection'
// import { OrbitGridSection } from './OrbitGridSection'

type Props = {
  name: string
  paneManagerStore?: PaneManagerStore
  selectionStore?: SelectionStore
  homeStore?: OrbitHomeStore
}

const getListStyle = isDraggingOver => ({
  background: isDraggingOver ? 'transparent' : 'transparent',
})

const getItemStyle = (isDragging, { left, top, ...draggableStyle }, index) => ({
  cursor: 'default',
  // some basic styles to make the items look a bit nicer
  userSelect: 'none',
  // change background colour if dragging
  background: isDragging ? 'transparent' : 'transparent',
  // styles we need to apply on draggables
  ...draggableStyle,
  top: index > 0 ? top - 90 : 0,
})

const findManyType = integration => ({
  take: 10,
  where: {
    integration,
  },
  relations: ['people'],
  order: { bitCreatedAt: 'DESC' },
})

class OrbitHomeStore {
  props: Props

  get isActive() {
    return this.props.paneManagerStore.activePane === this.props.name
  }

  setSelectionHandler = react(
    () => [this.isActive, this.results],
    ([isActive]) => {
      ensure('is active', isActive)
      console.log('set home sleection stuff')
      this.props.selectionStore.setResults(this.results)
    },
  )

  results = react(
    () => [this.allStreams, this.allData, this.sortOrder],
    ([streams, data, order]) => {
      console.log('update results', this.sortOrder, order)
      let results: SelectionGroup[] = []
      let offset = 0
      for (const id of order) {
        const items = data[id]
        if (!items || !items.length) {
          continue
        }
        const { name } = streams.find(x => x.id === `${id}`)
        results.push({ name, type: 'row', items, startIndex: offset, id })
        offset += items.length
      }
      return results
    },
    {
      defaultValue: [],
    },
  )

  allStreams = [
    {
      id: '0',
      name: 'People',
      model: PersonBitModel,
      query: {
        take: 20,
      },
    },
    {
      id: '1',
      name: 'Slack',
      model: BitModel,
      query: findManyType('slack'),
    },
    {
      id: '2',
      name: 'Gmail',
      model: BitModel,
      query: findManyType('gmail'),
    },
    {
      id: '3',
      name: 'Google Drive',
      model: BitModel,
      query: findManyType('gdrive'),
    },
    {
      id: '4',
      name: 'Github',
      model: BitModel,
      query: findManyType('github'),
    },
    {
      id: '5',
      name: 'Confluence',
      model: BitModel,
      query: findManyType('confluence'),
    },
    { id: '6', name: 'Jira', model: BitModel, query: findManyType('jira') },
  ]

  sortOrder = [0, 1, 2, 3, 4, 5, 6]

  reorder = (startIndex, endIndex) => {
    const order = [...this.sortOrder]
    const [removed] = order.splice(startIndex, 1)
    order.splice(endIndex, 0, removed)
    this.sortOrder = order
  }

  allData = {}

  updateCarouselData = react(
    () => this.allStreams,
    () => {
      // dispose before re-run
      if (this.updateCarouselData) {
        this.updateCarouselData.dispose()
      }

      const disposers = []

      console.log('setting up observers...', this.allStreams)

      for (const { id, name, model, query } of this.allStreams) {
        const subscription = observeMany(model, {
          args: query,
        }).subscribe(values => {
          console.log('update model data', name, values)
          this.allData = {
            ...this.allData,
            [id]: values,
          }
        })

        disposers.push(() => subscription.unsubscribe())
      }

      const dispose = () => disposers.map(x => x())
      // @ts-ignore
      this.subscriptions.add({ dispose })

      return {
        dispose,
      }
    },
  )
}

@view.attach('searchStore', 'selectionStore', 'paneManagerStore')
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
    const { homeStore, selectionStore } = this.props
    // we react to this so keep this here
    homeStore.results
    return (
      <SubPane name="home" fadeBottom>
        <DragDropContext onDragEnd={this.onDragEnd}>
          <Droppable droppableId="droppable">
            {(provided, snapshot) => (
              <div
                ref={provided.innerRef}
                style={getListStyle(snapshot.isDraggingOver)}
              >
                {/* <SuggestionBarVerticalPad /> */}
                {homeStore.results.map(
                  ({ id, name, items, startIndex }, index) => {
                    const height = name === 'People' ? 60 : 90
                    return (
                      <Draggable key={id} draggableId={id} index={index}>
                        {(provided, snapshot) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            style={getItemStyle(
                              snapshot.isDragging,
                              provided.draggableProps.style,
                              index,
                            )}
                          >
                            <OrbitCarouselSection
                              startIndex={startIndex}
                              items={items}
                              homeStore={homeStore}
                              categoryName={name}
                              cardHeight={height}
                            />
                          </div>
                        )}
                      </Draggable>
                    )
                  },
                )}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>
        {/* this is a nice lip effect */}
        <View height={20} />
      </SubPane>
    )
  }
}

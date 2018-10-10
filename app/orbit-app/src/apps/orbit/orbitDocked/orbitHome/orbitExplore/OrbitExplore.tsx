import * as React from 'react'
import { view, react, ensure } from '@mcro/black'
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd'
import { PaneManagerStore } from '../../../PaneManagerStore'
import { SelectionStore, SelectionGroup } from '../../SelectionStore'
import { AppsStore } from '../../../../AppsStore'
import { OrbitCarouselSection } from '../OrbitCarouselSection'
import { OrbitCard } from '../../../../../views/OrbitCard'
import { observeMany } from '@mcro/model-bridge'
import { allStreams } from './allStreams'

type Props = {
  paneManagerStore?: PaneManagerStore
  selectionStore?: SelectionStore
  appsStore?: AppsStore
  store?: OrbitExploreStore
}

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

class OrbitExploreStore {
  props: Props
  streams: { [a: string]: { values: any[]; name: string } } = {}
  sortOrder = [0, 1, 2, 3, 4, 5, 6]

  get isActive() {
    return this.props.paneManagerStore.activePane === 'explore'
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
        // @ts-ignore
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

  reorder = (startIndex, endIndex) => {
    const order = [...this.sortOrder]
    const [removed] = order.splice(startIndex, 1)
    order.splice(endIndex, 0, removed)
    this.sortOrder = order
  }
}

@view.attach('paneManagerStore', 'selectionStore', 'appsStore')
@view.attach({
  store: OrbitExploreStore,
})
@view
export class OrbitExplore extends React.Component<Props> {
  private onDragEnd = result => {
    // dropped outside the list
    if (!result.destination) {
      return
    }
    this.props.store.reorder(result.source.index, result.destination.index)
  }

  render() {
    const { store } = this.props
    const { results } = store
    return (
      <DragDropContext onDragEnd={this.onDragEnd}>
        <Droppable droppableId="droppable">
          {(provided, snapshot) => {
            return (
              <div ref={provided.innerRef} style={getListStyle(snapshot.isDraggingOver)}>
                {results.map(({ id, name, items, startIndex }, index) => {
                  if (name === 'Apps') {
                    return null
                  }
                  const height = name === 'People' ? 60 : 80
                  const width = 180
                  return (
                    <Draggable key={id} draggableId={id} index={index}>
                      {(provided, snapshot) => {
                        return (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            style={getItemStyle(snapshot.isDragging, provided.draggableProps.style)}
                          >
                            <OrbitCarouselSection
                              startIndex={startIndex}
                              items={items}
                              homeStore={store}
                              categoryName={name === 'Apps' ? null : name}
                              cardSpace={6}
                              horizontalPadding={12}
                              cardHeight={height}
                              cardWidth={width}
                              CardView={OrbitCard}
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
  }
}

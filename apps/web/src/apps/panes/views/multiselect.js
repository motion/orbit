import { view } from '@mcro/black'
import Mousetrap from 'mousetrap'
import { SHORTCUTS } from '~/stores/rootStore'
import * as UI from '@mcro/ui'
import { includes, findIndex, without } from 'lodash'
import { fuzzy } from '~/helpers'

@view
class Item {
  render({ isActive, isHighlight, onHighlight, onSelect, children }) {
    return (
      <item
        $$row
        $highlight={isHighlight}
        $active={isActive}
        onMouseEnter={onHighlight}
        onClick={onSelect}
      >
        {children}
      </item>
    )
  }

  static style = {
    item: {
      userSelect: 'none',
      flex: 1,
    },
  }
}

@view
class Items {
  render({
    items,
    onActivate,
    renderItem,
    onHighlight,
    activeIds,
    highlightId,
  }) {
    const renderWrappedItem = (item, index) => {
      const isActive = includes(activeIds, item.id)
      const isHighlight = highlightId === item.id
      return (
        <Item
          {...item}
          key={item.id}
          onSelect={() => onActivate(item.id)}
          onHighlight={() => onHighlight(item.id)}
          isHighlight={isHighlight}
          isActive={isActive}
        >
          {renderItem(item, { isActive, index, isHighlight })}
        </Item>
      )
    }

    return <items>{items.map(renderWrappedItem)}</items>
  }

  static style = {}
}

const toggle = (xs, x) => (includes(xs, x) ? without(xs, x) : [...xs, x])

class MultiSelectStore {
  highlightId = null
  search = ''
  handlers = {}

  start() {
    this.attachRef('main', window)
  }

  attachRef = (name, el) => {
    if (this.handlers[name]) this.handlers[name].reset()
    this.handlers[name] = new Mousetrap(el)
    for (const actionName of Object.keys(SHORTCUTS)) {
      if (this.actions[actionName]) {
        const chord = SHORTCUTS[actionName]
        this.handlers[name].bind(chord, this.actions[actionName])
      }
    }
  }

  onSearchRef = el => {
    this.attachRef('search', el)
  }

  stop() {
    Object.keys(this.handlers).forEach(name => {
      this.handlers[name].reset()
    })
    this.handlers = {}
  }

  get highlightIndex() {
    if (this.highlightId === null) return null
    return findIndex(this.props.items, ({ id }) => id === this.highlightId)
  }

  get activeItems() {
    return fuzzy(
      this.props.items.map(i => ({ ...i, title: i.id })),
      this.search
    )
  }

  setHighlightIndex = index => {
    if (this.activeItems.length === 0) {
      this.highlightId = null
    } else {
      this.highlightId = this.activeItems[index].id
    }
  }

  setSearch = ({ target: { value } }) => {
    this.search = value
    this.setHighlightIndex(0)
  }

  toggleActive = id => {
    const activeIds = toggle([...this.props.activeIds], id)
    this.props.onChange && this.props.onChange(activeIds)
  }

  // todo make work
  actions = {
    up: e => {
      e.preventDefault()
      if (this.highlightIndex !== 0) {
        this.setHighlightIndex(this.highlightIndex - 1)
      }
    },

    esc: () => {
      this.props.onClose()
    },

    enter: () => {
      this.toggleActive(this.highlightId)
    },

    down: e => {
      e.preventDefault()
      if (this.highlightIndex === null) {
        this.setHighlightIndex(0)
      } else {
        if (this.highlightIndex < this.props.items.length - 1) {
          this.setHighlightIndex(this.highlightIndex + 1)
        }
      }
    },
  }
}

@view({
  store: MultiSelectStore,
})
export default class Multiselect {
  render({ store, activeIds, renderItem }) {
    return (
      <UI.Theme name="light">
        <container onMouseLeave={() => (store.highlightId = null)}>
          <search>
            <UI.Input
              autoFocus
              onChange={store.setSearch}
              value={store.search}
              getRef={store.onSearchRef}
              placeholder="search"
              $searchText
            />
          </search>
          <items>
            <Items
              items={store.activeItems}
              highlightId={store.highlightId}
              activeIds={activeIds}
              onHighlight={id => (store.highlightId = id)}
              renderItem={renderItem}
              onActivate={store.toggleActive}
            />
          </items>
        </container>
      </UI.Theme>
    )
  }

  static style = {
    container: {
      background: 'white',
    },
    search: {
      margin: 10,
    },
  }
}

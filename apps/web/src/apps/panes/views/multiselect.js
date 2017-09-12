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

@view({
  store: class SelectStore {
    highlightId = null
    activeIds = []
    search = ''

    start() {
      this.handlers = new Mousetrap(window)
      for (const name of Object.keys(SHORTCUTS)) {
        if (this.actions[name]) {
          const chord = SHORTCUTS[name]
          this.handlers.bind(chord, this.actions[name])
        }
      }
    }

    get highlightIndex() {
      if (this.highlightId === null) return null
      return findIndex(this.props.items, ({ id }) => id === this.highlightId)
    }

    setHighlightIndex = index => {
      this.highlightId = this.props.items[index].id
    }

    toggleActive = id => {
      this.activeIds = toggle(this.activeIds, id)
    }

    // todo make work
    actions = {
      up: () => {
        if (this.highlightIndex !== 0) {
          this.setHighlightIndex(this.highlightIndex - 1)
        }
      },

      enter: () => {
        this.toggleActive(this.highlightId)
      },

      down: () => {
        if (this.highlightIndex === null) {
          this.setHighlightIndex(0)
        } else {
          if (this.highlightIndex < this.props.items.length - 1) {
            this.setHighlightIndex(this.highlightIndex + 1)
          }
        }
      },
    }
  },
})
export default class Multiselect {
  render({ store, items, renderItem }) {
    const activeItems = fuzzy(
      items.map(i => ({ ...i, title: i.id })),
      store.search
    )

    return (
      <UI.Theme name="light">
        <container onMouseLeave={() => (store.highlightId = null)}>
          <search>
            <UI.Input
              onChange={e => (store.search = e.target.value)}
              value={store.search}
              placeholder="search"
              $searchText
            />
          </search>
          <items>
            <Items
              items={activeItems}
              highlightId={store.highlightId}
              activeIds={store.activeIds}
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

import { view } from '@mcro/black'
import * as UI from '@mcro/ui'
import { includes, without } from 'lodash'
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

    // todo make work
    actions = {
      down: () => {},
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
              onActivate={id => (store.activeIds = toggle(store.activeIds, id))}
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

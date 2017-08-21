import { view } from '@mcro/black'
import * as UI from '@mcro/ui'
import { HotKeys } from '~/helpers'
import { capitalize, includes } from 'lodash'

const everyone = ['me', 'nick', 'steph']

@view
class PersonPicker {
  render({ filter = '', onSelect, onHighlight, highlight }) {
    const people = everyone.filter(p => includes(p, filter))

    return (
      <people>
        {people.map(person =>
          <person
            $$row
            $highlight={person === highlight}
            onMouseEnter={() => onHighlight(person)}
            onClick={() => onSelect(person)}
          >
            <img $avatar src={`/images/${person}.jpg`} />
            <name>
              {capitalize(person)}
            </name>
          </person>
        )}
      </people>
    )
  }

  static style = {
    people: {
      height: 150,
      marginTop: 3,
    },
    person: {
      padding: 6,
      transition: 'background 80ms ease-in',
      marginTop: 5,
      alignItems: 'center',
    },
    avatar: {
      width: 24,
      height: 24,
      borderRadius: 100,
    },
    highlight: {
      background: '#edf5fd',
    },
    name: {
      marginLeft: 15,
    },
  }
}

@view({
  store: class PickerStore {
    highlight = null
    search = ''

    // todo make work
    actions = {
      down: () => {},
    }
  },
})
export default class PickerTooltip {
  render({ store, popoverProps, onSelect }) {
    return (
      <HotKeys handlers={store.actions}>
        <UI.Popover
          $popover
          openOnHover
          {...popoverProps}
          towards="right"
          distance={20}
        >
          <UI.Input
            type="text"
            value={store.search}
            onChange={e => (store.search = e.target.value)}
          />
          <PersonPicker
            highlight={store.highlight}
            onHighlight={person => (store.highlight = person)}
            filter={store.search}
            onSelect={props => {
              console.log('popover is', this.popover)
              onSelect(...props)
            }}
          />
        </UI.Popover>
      </HotKeys>
    )
  }

  static style = {
    popover: {
      background: 'white',
      boxShadow: '1px 1px 5px rgba(0,0,0,.08)',
      borderRadius: 4,
    },
  }
}

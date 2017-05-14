import { view, Shortcuts } from '~/helpers'
import { uniqBy } from 'lodash'
import { List, Link, Input, Button } from '~/ui'
import { Place } from '@jot/models'
import Login from './login'
import { SIDEBAR_WIDTH } from '~/constants'
import Router from '~/router'
import fuzzy from 'fuzzy'

const Text = props => <view $$marginLeft={props.active ? -2 : 0} {...props} />

const SideBarItem = ({ children, after, ...props }) => (
  <Link
    {...props}
    $$style={{
      width: '100%',
      fontSize: 18,
      padding: [7, 10],
      cursor: 'pointer',
      '&:hover': {
        background: '#fafafa',
      },
    }}
    active={{
      background: '#333',
      color: '#fff',
      '&:hover': {
        background: '#222',
      },
    }}
  >
    {children}
    <span $$fontSize={10} if={after}>
      {after}
    </span>
  </Link>
)

class SidebarStore {
  places = Place.all()
  placeInput = null
  creatingPlace = false
  filter = ''

  get allPlaces() {
    const myPlace = {
      title: App.loggedIn ? App.user.name : 'me',
      url: _ => '/',
    }
    const results = [
      myPlace,
      this.creatingPlace && { create: true },
      ...(this.places || []),
    ].filter(x => !!x)

    if (this.filter) {
      return fuzzy
        .filter(this.filter, results, {
          extract: el => (el && el.title) || '',
        })
        .map(i => i.original)
    }
    return uniqBy(results, r => r.title)
  }

  createPlace = async e => {
    e.preventDefault()
    const val = this.placeInput.value
    const place = await Place.createWithHome(val)
    this.creatingPlace = false
    Router.go(place.url())
  }

  onNewPlace = ref => {
    this.placeInput = ref
    if (ref) {
      ref.focus()
    }
  }

  clearCreating = () => {
    this.createPlace = false
  }

  handleShortcuts = (action, event) => {
    console.log('handle', action)
    switch (action) {
      case 'esc':
        this.clearCreating()
        break
    }
  }
}

@view({ store: SidebarStore })
export default class Sidebar {
  render({ store }) {
    consoe.log(store.allPlaces)
    return (
      <sidebar>
        <Shortcuts name="all" handler={store.handleShortcuts}>
          <content $$flex $$undraggable>
            <Login />

            <title
              $$row
              $$justify="space-between"
              $$padding={6}
              $$borderBottom={[1, 'dotted', '#eee']}
            >
              <input
                $search
                placeholder="places"
                onChange={e => (store.filter = e.target.value)}
              />
              <Button
                icon="ui-add"
                onClick={() => (store.creatingPlace = true)}
              />
            </title>
            <main $$draggable if={store.allPlaces}>
              <List
                controlled
                items={store.allPlaces}
                onSelect={place => {
                  if (place && place.url) {
                    Router.go(place.url())
                  }
                }}
                getItem={(place, index) => {
                  return (
                    <SideBarItem match={place.url && place.url()}>
                      <Text editable onChange={item => store.placeInput(item)}>
                        {place.title}
                      </Text>
                    </SideBarItem>
                  )
                }}
              />
            </main>
          </content>

          <sidebar if={App.activePage.sidebar}>
            {App.activePage.sidebar}
          </sidebar>
        </Shortcuts>
      </sidebar>
    )
  }

  static style = {
    sidebar: {
      width: SIDEBAR_WIDTH,
      borderLeft: [1, 'dotted', '#eee'],
      overflowY: 'scroll',
      overflowX: 'visible',
      userSelect: 'none',
    },
    main: {
      flex: 1,
    },
    search: {
      border: 'none',
      fontSize: 16,
      width: '70%',
      lineHeight: '1.5rem',
    },
  }
}

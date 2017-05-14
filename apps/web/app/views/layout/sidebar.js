import { view, Shortcuts } from '~/helpers'
import { uniqBy } from 'lodash'
import { List, Link, Input, Button } from '~/ui'
import { Place } from '@jot/models'
import Login from './login'
import { SIDEBAR_WIDTH } from '~/constants'
import Router from '~/router'
import fuzzy from 'fuzzy'

const SideBarLink = ({ children, after, ...props }) => (
  <Link
    {...props}
    $$style={{
      width: '100%',
      fontWeight: 400,
      fontSize: 18,
      color: 'purple',
      padding: [7, 10],
      cursor: 'pointer',
      '&:hover': {
        background: '#fafafa',
      },
    }}
    active={{
      background: '#fff',
      color: '#000',
      '&:hover': {
        background: '#fafafa',
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
    return (
      <Shortcuts $side name="all" handler={store.handleShortcuts}>
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
                if (place.create) {
                  return (
                    <List.Item padding={0}>
                      <form onSubmit={store.createPlace}>
                        <Input
                          $$margin={0}
                          $$padding={[11, 10]}
                          $$fontSize={15}
                          $$width="100%"
                          noBorder
                          getRef={store.onNewPlace}
                          placeholder="new place"
                        />
                      </form>
                    </List.Item>
                  )
                }
                return (
                  <SideBarLink match={place.url()}>
                    {place.title}
                  </SideBarLink>
                )
              }}
            />
          </main>
        </content>

        <sidebar if={App.activePage.sidebar}>
          {App.activePage.sidebar}
        </sidebar>
      </Shortcuts>
    )
  }

  static style = {
    side: {
      width: SIDEBAR_WIDTH,
      borderLeft: [1, '#eee'],
      overflowY: 'scroll',
      overflowX: 'hidden',
      userSelect: 'none',
    },
    main: {
      flex: 1,
    },
    h2: {
      fontSize: 14,
      fontWeight: 300,
      padding: [4, 8, 0],
      color: [0, 0, 0, 0.5],
    },
    search: {
      border: 'none',
      fontSize: 16,
      width: '70%',
      lineHeight: '1.5rem',
    },
  }
}

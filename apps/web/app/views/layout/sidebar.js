import { view, Shortcuts } from '~/helpers'
import { uniqBy } from 'lodash'
import { List, Link, Input, Button } from '~/ui'
import { Place } from '@jot/models'
import Login from './login'
import { SIDEBAR_WIDTH } from '~/constants'
import Router from '~/router'
import fuzzy from 'fuzzy'

const Text = ({ getRef, ...props }) => (
  <text ref={getRef} $$marginLeft={props.active ? -2 : 0} {...props} />
)

const SideBarItem = ({ children, isEditing, after, ...props }) => (
  <Link
    {...props}
    $$style={{
      background: isEditing ? '#fafafa' : 'transparent',
      width: '100%',
      fontSize: 18,
      padding: [7, 10],
      cursor: isEditing ? 'text' : 'pointer',
      '&:hover': {
        background: '#fafafa',
      },
    }}
    active={
      !isEditing && {
        background: '#333',
        color: '#fff',
        '&:hover': {
          background: '#222',
        },
      }
    }
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
  editingPlace = false
  filter = ''

  get allPlaces() {
    const myPlace = {
      title: App.loggedIn ? App.user.name : 'me',
      url: _ => '/',
    }
    const results = [
      myPlace,
      this.editingPlace === true && { create: true },
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

  createPlace = async () => {
    const val = this.placeInput.innerText
    if (val) {
      const place = await Place.createWithHome(val)
      this.editingPlace = false
      Router.go(place.url())
    }
  }

  onNewPlace = ref => {
    this.placeInput = ref
    if (ref) {
      ref.focus()
    }
  }

  onNewPlaceKey = e => {
    if (e.which === 13) {
      e.preventDefault()
    }
  }

  clearCreating = () => {
    this.editingPlace = false
  }

  setEditable = place => {
    this.editingPlace = place._id
  }

  handleShortcuts = (action, event) => {
    switch (action) {
      case 'enter':
        event.preventDefault()
        this.createPlace()
      case 'esc':
        event.preventDefault()
        this.clearCreating()
        break
    }
  }
}

@view({ store: SidebarStore })
export default class Sidebar {
  render({ store }) {
    return (
      <Shortcuts isolate name="all" handler={store.handleShortcuts}>
        <sidebar $$flex>
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
                onClick={() => (store.editingPlace = true)}
              />
            </title>
            <main $$scrollable $$draggable if={store.allPlaces}>
              <List
                controlled
                items={store.allPlaces}
                onSelect={place => {
                  console.log('on select', place)
                  if (place && place.url) {
                    Router.go(place.url())
                  }
                }}
                getItem={(place, index) => {
                  const isEditing =
                    place.create || store.editingPlace === place._id

                  return (
                    <SideBarItem
                      isEditing={isEditing}
                      match={place.url && place.url()}
                      onDoubleClick={() => store.setEditable(place)}
                    >
                      <Text
                        {...isEditing && {
                          contentEditable: true,
                          suppressContentEditableWarning: true,
                          getRef: store.onNewPlace,
                        }}
                      >
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
        </sidebar>
      </Shortcuts>
    )
  }

  static style = {
    sidebar: {
      width: SIDEBAR_WIDTH,
      borderLeft: [1, 'dotted', '#eee'],
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

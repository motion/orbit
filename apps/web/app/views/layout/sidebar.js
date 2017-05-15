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

const SideBarItem = ({ children, isEditing, after, ...props }) => {
  const editStyle = isEditing && {
    background: '#fafafa',
    cursor: 'text',
  }

  return (
    <Link
      {...props}
      $$style={{
        color: [0, 0, 0, 0.75],
        background: 'transparent',
        width: '100%',
        fontSize: 14,
        padding: [4, 10],
        cursor: 'pointer',
        '&:hover': {
          background: '#fafafa',
        },
        ...editStyle,
      }}
      active={{
        fontWeight: 400,
        background: [0, 0, 0, 0.025],
        color: [0, 0, 0, 0.9],
        '&:hover': {
          background: '#f2f2f2',
        },
      }}
    >
      {children}
    </Link>
  )
}

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
      margin: ['auto', 0],
      fontSize: 14,
      width: '70%',
      opacity: 0.6,
      '&:hover': {
        opacity: 1,
      },
      '&:focus': {
        opacity: 1,
      },
    },
  }
}

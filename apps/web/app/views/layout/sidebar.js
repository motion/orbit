import { view, Shortcuts } from '~/helpers'
import { uniqBy } from 'lodash'
import { Pane, ContextMenu, List, Link, Input, Button } from '~/ui'
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
    background: '#faecf7',
    cursor: 'text',
  }

  return (
    <Link
      {...props}
      style={{
        gloss: true,
        color: [0, 0, 0, 0.75],
        width: '100%',
        fontSize: 14,
        padding: [4, 10],
        cursor: 'pointer',
        '&:hover': {
          background: '#faecf7',
        },
        ...editStyle,
      }}
      active={{
        fontWeight: 500,
        color: '#684f63',
        background: '#f1d6eb',
        '&:hover': {
          background: '#f1d6eb',
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
  active = null
  editingPlace = false
  filter = ''
  sidePlaces = []
  allPlacesClosed = false
  sidePlacesClosed = false

  get tempPlace() {
    return this.editingPlace && this.editingPlace.temporary && this.editingPlace
  }

  get allPlaces() {
    const myPlace = {
      title: App.loggedIn ? App.user.name : 'me',
      url: _ => '/',
    }
    const results = [myPlace, this.tempPlace, ...(this.places || [])].filter(
      x => !!x
    )

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
    if (!this.placeInput) {
      return
    }
    const val = this.placeInput.innerText
    console.log('val is', val)
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
      document.execCommand('selectAll', false, null)
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

  setEditing = place => {
    this.editingPlace = place
  }

  setActive = place => {
    this.active = place
  }

  handleShortcuts = (action, event) => {
    console.log('sidebar got', action)
    switch (action) {
      case 'enter':
        event.preventDefault()
        console.log('editing place?', this.editingPlace)
        if (this.editingPlace) {
          console.log(event.target, event, event.currentTarget)
          this.editingPlace.title = event.target.innerText
        } else {
          this.createPlace()
        }
      case 'esc':
        event.preventDefault()
        this.clearCreating()
        break
      case 'delete':
        if (this.editingPlace) return
        const shouldDelete = confirm(`Delete place ${this.active.title}`)
        if (shouldDelete) {
          this.active.delete()
        }
        break
    }
  }
}

@view({ store: SidebarStore })
export default class Sidebar {
  getListItem = (place, index) => {
    const { store } = this.props
    const isEditing = store.editingPlace && store.editingPlace._id === place._id

    return (
      <ContextMenu.Target data={place}>
        <SideBarItem
          isEditing={isEditing}
          match={place.url && place.url()}
          onDoubleClick={() => store.setEditing(place)}
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
      </ContextMenu.Target>
    )
  }

  render({ store }) {
    return (
      <ContextMenu
        options={[
          {
            title: 'Delete',
            onSelect: place => place.delete(),
          },
        ]}
      >
        <sidebar $$flex>
          <top>
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
                onChange={e => store.filter = e.target.value}
              />
              <Button
                icon="simple-add"
                onClick={() =>
                  store.setEditing({ _id: Math.random(), temporary: true })}
              />
            </title>
          </top>

          <content $$draggable>
            <Pane
              if={store.allPlaces}
              scrollable
              collapsable
              title="me"
              collapsed={store.allPlacesClosed}
              onSetCollapse={store.ref('allPlacesClosed').set}
            >
              <Shortcuts name="all" handler={store.handleShortcuts}>
                <List
                  controlled
                  items={store.allPlaces}
                  onSelect={place => {
                    store.setActive(place)
                    if (place && place.url) {
                      Router.go(place.url())
                    }
                  }}
                  getItem={this.getListItem}
                />
              </Shortcuts>
            </Pane>
            <Pane
              if={store.sidePlaces}
              title="all"
              collapsable
              collapsed={store.sidePlacesClosed}
              onSetCollapse={store.ref('sidePlacesClosed').set}
            >
              <List
                controlled
                items={store.sidePlaces}
                onSelect={place => {
                  store.setActive(place)
                  if (place && place.url) {
                    Router.go(place.url())
                  }
                }}
                getItem={this.getListItem}
              />
            </Pane>
          </content>

          <sidebar if={App.activePage.sidebar}>
            {App.activePage.sidebar}
          </sidebar>
        </sidebar>
      </ContextMenu>
    )
  }

  static style = {
    content: {
      flex: 1,
    },
    sidebar: {
      width: SIDEBAR_WIDTH,
      borderLeft: [1, 'dotted', '#eee'],
      userSelect: 'none',
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

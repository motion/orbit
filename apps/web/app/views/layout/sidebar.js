// @flow
import { view, Shortcuts } from '~/helpers'
import { uniqBy } from 'lodash'
import { Text, Pane, ContextMenu, List, Link, Input, Button } from '~/ui'
import { Place } from '@jot/models'
import Login from './login'
import { SIDEBAR_WIDTH } from '~/constants'
import Router from '~/router'
import fuzzy from 'fuzzy'

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

  onFinishEdit = async title => {
    this.editingPlace.title = title
    this.editingPlace.members = []
    const isTemp = this.editingPlace.temporary
    const place = await this.editingPlace.save()
    if (isTemp) {
      Router.go(place.url())
    }
    this.editingPlace = null
  }

  clearEditing = () => {
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
      case 'esc':
        event.preventDefault()
        this.clearEditing()
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

@view({
  store: SidebarStore,
})
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
            editable={isEditing}
            autoselect
            onFinishEdit={store.onFinishEdit}
            onCancelEdit={store.clearEditing}
          >
            {place.title}
          </Text>
        </SideBarItem>
      </ContextMenu.Target>
    )
  }

  render({ store }) {
    return (
      <sidebar>
        <top>
          <Login />
          <title $$row $$justify="space-between" $$padding={[4, 6]}>
            <input
              $search
              placeholder="places"
              onChange={e => (store.filter = e.target.value)}
            />
            <Button
              chromeless
              icon="simple-add"
              onClick={() =>
                store.setEditing({
                  _id: Math.random(),
                  temporary: true,
                  save() {
                    return Place.create({ title: this.title })
                  },
                })}
            />
          </title>
        </top>

        <content $$draggable>
          <Pane
            if={store.allPlaces}
            scrollable
            collapsable
            title="Saved"
            collapsed={store.allPlacesClosed}
            onSetCollapse={store.ref('allPlacesClosed').set}
          >
            <ContextMenu
              options={[
                {
                  title: 'Delete',
                  onSelect: place => place.delete(),
                },
              ]}
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
            </ContextMenu>
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

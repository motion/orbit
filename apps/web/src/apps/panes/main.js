// @flow
import React from 'react'
import { view } from '@mcro/black'
import * as UI from '@mcro/ui'
import { CurrentUser, Document, Thing } from '~/app'
import { uniq } from 'lodash'
import { filterItem } from './helpers'
import { Atom } from '@mcro/models'
import { OS } from '~/helpers'
import * as Pane from './pane'

let allCards = null

class BarMainStore {
  searchResults: Array<Document> = []
  cards = []

  start() {
    this.props.getRef(this)

    if (allCards) {
      this.cards = allCards
    } else {
      Atom.getAll().then(cards => {
        this.cards = cards.map(card => ({
          title: card.card.name,
          data: {
            title: card.card.name,
            content: card.card.content,
            id: card.card.id,
            comments: card.comments,
            labels: card.card.labels,
            service: card.service,
          },
          searchTags: card.searchWords || card.service,
          type: 'task',
          icon: card.service,
        }))
      })
      allCards = this.cards
    }
  }

  get root() {
    return CurrentUser.home
  }

  get browse() {
    return [
      {
        title: 'Recent',
        type: 'feed',
        icon: 'radio',
        data: {
          special: true,
        },
      },
      {
        data: { message: 'assigned' },
        title: 'Assigned to me',
        type: 'message',
        icon: 'check',
      },
      {
        data: { message: 'my team' },
        title: 'My Team',
        category: 'Browse',
        type: 'message',
        url() {
          return '/?home=true'
        },
        icon: 'objects_planet',
      },
      {
        data: {},
        title: 'Test Page',
        category: 'Browse',
        type: 'test',
        url() {
          return '/?home=true'
        },
        icon: 'objects_planet',
      },
      {
        data: {},
        title: 'Orbit → New GitHub Issue',
        category: 'Browse',
        type: 'newIssue',
        url() {
          return '/?home=true'
        },
        icon: 'objects_planet',
      },
      {
        data: {},
        title: 'Gloss → New GitHub Issue',
        category: 'Browse',
        type: 'newIssue',
        url() {
          return '/?home=true'
        },
        icon: 'objects_planet',
      },
      {
        data: {},
        title: 'Motion → New GitHub Issue',
        category: 'Browse',
        type: 'newIssue',
        url() {
          return '/?home=true'
        },
        icon: 'objects_planet',
      },
      {
        data: { message: 'from company' },
        title: 'Company',
        category: 'Browse',
        type: 'message',
        url() {
          return '/?home=true'
        },
        icon: 'objects_planet',
      },
    ]
  }

  get people() {
    return [
      {
        title: 'Stephanie',
        type: 'feed',
        data: {
          image: 'steph',
        },
        category: 'People',
      },
      {
        title: 'Nate',
        type: 'feed',
        data: { image: 'me' },
        category: 'People',
      },
      {
        title: 'Nick',
        type: 'feed',
        data: { image: 'nick' },
        category: 'People',
      },
    ]
  }

  get results() {
    if (!CurrentUser.loggedIn) {
      return [{ title: 'Login', type: 'login', static: true }]
    }

    const { searchResults, cards, browse, people } = this

    const results = filterItem(
      [
        ...browse,
        ...cards,
        ...(searchResults || []),
        ...people,
        {
          title: 'Settings',
          icon: 'gear',
          type: 'message',
          data: {
            message: 'Open Settings',
            icon: 'gear',
          },
          onSelect: () => {
            OS.send('open-settings')
          },
          category: 'Settings',
        },
      ],
      this.props.search
    )

    if (this.props.search) {
      results.push({
        title: `Search "${this.props.search}"`,
        type: 'feed',
      })
    }

    return results
  }

  actionsByType = {
    issue: ['archive', 'add label', 'milestone'],
  }

  getActions = ({ type }) => {
    return this.actionsByType[type] || []
  }

  search = async () => {
    if (!this.props.search) {
      this.searchResults = []
      return
    }

    const [searchResults, pathSearchResults] = await Promise.all([
      Thing.search && Thing.search(this.props.search).exec(),
      Thing.collection
        .find()
        .where('slug')
        .regex(new RegExp(`^${this.props.search}$`, 'i'))
        .where({ home: { $ne: true } })
        .limit(20)
        .exec(),
    ])

    this.searchResults = uniq(
      [...(searchResults || []), ...pathSearchResults],
      x => x.id
    ).map(doc => {
      return {
        doc,
        title: doc.title,
        type: 'browse',
        category: 'Search Results',
      }
    })
  }

  select = index => {
    this.props.navigate(this.results[index])
  }
}

@view.provide({ paneStore: Pane.Store })
@view({
  store: BarMainStore,
})
export default class BarMain {
  lastSearch = ''

  componentWillReceiveProps({ search, activeRow }) {
    if (this.lastSearch !== search) {
      this.props.store.search()
      this.lastSearch = this.props.search
    }
  }

  render({ store, paneStore, isActive, activeIndex, paneProps, onSelect }) {
    const secondary = item => {
      if (item.data && item.data.service === 'github')
        return (
          <secondary>
            <spread $$row>
              <left>
                {item.data.comments.length} replies
              </left>
              <right>
                {item.data.labels}
              </right>
            </spread>
          </secondary>
        )

      return null
    }
    return (
      <Pane.Card isActive={isActive} width={340} $pane>
        {false &&
          store.results.map((result, index) => {
            return (
              <Pane.Selectable
                options={{
                  when: '3 days ago',
                  name: result.title,
                  actions: store.getActions(result),
                  id: result.title,
                  body: null, //<h2>hello</h2>,
                  index,
                }}
              />
            )
          })}
        <UI.List
          if={store.results}
          selected={activeIndex}
          onSelect={(item, index) => {
            onSelect(index)
          }}
          itemProps={paneProps.itemProps}
          groupKey="category"
          items={store.results}
          getItem={(result, index) =>
            <Pane.Selectable
              options={{
                when: '3 days ago',
                name: result.title,
                actions: store.getActions(result),
                id: result.title,
                index,
              }}
            />}
        />
      </Pane.Card>
    )
  }

  static style = {
    spread: {
      justifyContent: 'space-between',
    },
    image: {
      width: 20,
      height: 20,
      borderRadius: 1000,
      margin: 'auto',
    },
  }
}

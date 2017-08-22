// @flow
import React from 'react'
import { view } from '@mcro/black'
import * as UI from '@mcro/ui'
import { CurrentUser, Document, Thing } from '~/app'
import { uniq } from 'lodash'
import { filterItem } from './helpers'
import { Atom } from '@mcro/models'

let allCards = null

class BarMainStore {
  searchResults: Array<Document> = []
  cards = []

  get root() {
    return CurrentUser.home
  }

  get actions() {
    return [
      // {
      //   title: 'Create new topic +',
      //   type: 'feed',
      //   category: 'Actions',
      // },
    ]
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
        title: 'Assigned to me',
        type: 'placeholder',
        icon: 'check',
      },
      {
        title: 'My Team',
        category: 'Browse',
        type: 'placeholder',
        url() {
          return '/?home=true'
        },
        icon: 'objects_planet',
      },
      {
        title: 'Company',
        category: 'Browse',
        type: 'placeholder',
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
      return [{ title: 'Login', type: 'login' }]
    }

    const { searchResults, cards, browse, people, actions } = this

    const results = filterItem(
      [
        ...browse,
        ...cards,
        ...(searchResults || []),
        ...people,
        ...actions,
        {
          title: 'Integrations',
          icon: 'gear',
          type: 'integrations',
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

    console.timeEnd('Main.results')
    return results
  }

  start() {
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

    this.props.getRef && this.props.getRef(this)
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

  get length() {
    return (this.results && this.results.length) || 0
  }

  select = index => {
    this.props.navigate(this.results[index])
  }
}

@view({
  store: BarMainStore,
})
export default class BarMain {
  lastSearch = ''

  componentWillReceiveProps() {
    if (this.lastSearch !== this.props.search) {
      this.props.store.search()
      this.lastSearch = this.props.search
    }
  }

  getLength = () => this.props.store.results.length

  getChildSchema = row => {
    const { store } = this.props
    const item = store.results[row]
    return { kind: item.type, data: item.data || {} }
  }

  render({ store, onSelect, onRef, activeIndex, paneProps }) {
    onRef(this)
    const secondary = item => {
      if (item.data && item.data.service === 'github')
        return (
          <spread $$row>
            <left>
              {item.data.comments.length} replies
            </left>
            <right>
              {item.data.labels}
            </right>
          </spread>
        )

      return null
    }

    return (
      <pane>
        <UI.List
          if={store.results}
          selected={activeIndex}
          onSelect={(item, index) => {
            onSelect(index)
          }}
          itemProps={paneProps.itemProps}
          groupKey="category"
          virtualized
          items={store.results}
          getItem={(result, index) =>
            <UI.ListItem
              onClick={() => onSelect(index)}
              highlight={index === activeIndex}
              key={result.id}
              icon={
                result.data && result.data.image
                  ? <img $image src={`/images/${result.data.image}.jpg`} />
                  : result.icon || (result.doc && result.doc.icon)
              }
              primary={result.title}
              secondary={secondary(result)}
            />}
        />
      </pane>
    )
  }

  static style = {
    pane: {
      width: 340,
    },
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

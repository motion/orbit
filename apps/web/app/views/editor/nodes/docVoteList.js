import React from 'react'
import { node, view, computed } from '~/helpers'
import App, { Document } from '@jot/models'
import { Button, Glow, Loading, Icon } from '~/ui'
import { isEqual } from 'lodash'
import Router from '~/router'
// nice oxford commas for votes
import listify from 'listify'
import { without, includes } from 'lodash'
import CardList from './lists/card'
import GridList from './lists/grid'

class DocListStore {
  // checking for inline prevents infinite recursion!
  //  <Editor inline /> === showing inside a document

  docs = !this.props.editorStore.inline &&
    Document.forHashtag(
      this.place && this.place.slug,
      this.props.node.data.get('hashtag')
    )

  get place() {
    return App.activePage.place
  }

  newHashtag = null
  saveName() {
    const { node: { data }, onChange } = this.props

    onChange(data.set('hashtag', this.newHashtag))
    this.newHashtag = null
  }

  newDocument = async () => {
    const doc = await Document.create({
      places: [App.activePlace],
      title: 'New Document',
      hashtags: [this.props.node.data.get('hashtag')],
    })
    Router.go(doc.url())
  }

  @computed get inputHashtag() {
    return this.newHashtag || this.props.node.data.get('hashtag')
  }

  onVote = _id => {
    const { node: { data }, onChange } = this.props

    const votes = JSON.parse(data.get('votes'))
    const voters = votes[_id] || []
    votes[_id] = includes(voters, App.user.name)
      ? without(voters, App.user.name)
      : [...voters, App.user.name]

    onChange(data.set('votes', JSON.stringify(votes)))
  }
}

const lightBlue = '#e7f6ff'
const darkBlue = `#0099e5`

@node
@view({
  store: DocListStore,
})
export default class DocLinkList {
  votesText = votes => {
    const plural = (s, i) => s + (i === 1 ? '' : 's')
    return `${votes.length} ${plural('vote', votes.length)} by ${listify(votes)}`
  }

  render({ node: { data }, editorStore, editing, store, children, ...props }) {
    const hasLoaded = !!store.docs
    const hasDocs = hasLoaded && store.docs.length > 0
    const hashtag = data.get('hashtag')
    const votes = JSON.parse(data.get('votes'))
    const showNoDocs = hasLoaded && !hasDocs

    return (
      <container contentEditable={false}>
        <top $$row>
          <latest $$row>
            latest #
            <input
              $edit
              spellcheck={false}
              onFocus={() => (store.newHashtag = hashtag)}
              onChange={e => (store.newHashtag = e.target.value)}
              onBlur={store.saveName}
              onKeyDown={e => e.which == 13 && e.target.blur()}
              value={store.inputHashtag}
            />
          </latest>
          <right if={!showNoDocs}>
            <Button icon="simple-add" onClick={store.newDocument}>
              create document
            </Button>
          </right>
        </top>
        <list>
          <loading if={!hasLoaded}><Loading $loading /></loading>
          <noDocs if={showNoDocs}>
            <text>no documents in #{hashtag}</text>
            <Button icon="simple-add" onClick={store.newDocument}>
              create document
            </Button>
          </noDocs>
          <docs if={hasLoaded && hasDocs}>
            {(store.docs || []).map((doc, index) => (
              <itemContainer key={doc._id} $notFirst={index > 0}>
                <item>
                  <votes>
                    <Button
                      icon={'up'}
                      iconColor={
                        includes(votes[doc._id] || [], App.user.name)
                          ? 'green'
                          : '#ccc'
                      }
                      onClick={() => store.onVote(doc._id)}
                    />
                  </votes>
                  <Glow
                    full
                    scale={0.7}
                    color={[255, 255, 255]}
                    opacity={0.04}
                  />
                  <text>{doc.title}</text>

                  <icon>
                    <Button
                      icon="arrows-1_circle-right-37"
                      iconColor={darkBlue}
                      onClick={() => Router.go(doc.url())}
                    />
                  </icon>
                </item>
                <status if={votes[doc._id].length > 0}>
                  {this.votesText(votes[doc._id])}
                </status>
              </itemContainer>
            ))}
          </docs>
        </list>
      </container>
    )
  }

  static style = {
    container: {
      marginTop: 5,
      marginBottom: 5,
    },
    input: {
      padding: 0,
      marginLeft: '1px !important',
      fontSize: 14,
      borderWidth: 0,
      marginLeft: 2,
      marginTop: 1,
      width: 150,
      '&:focus': {},
      '&:hover': {
        borderBottom: '1px dashed #333',
      },
    },
    top: {
      justifyContent: 'space-between',
      paddingTop: 3,
      paddingBottom: 3,
      fontSize: 14,
      color: '#555',
    },
    latest: {
      marginTop: 8,
    },
    list: {
      borderRadius: 5,
      border: `1px solid ${lightBlue}`,
    },
    loading: {
      padding: 20,
    },
    noDocs: {
      alignItems: 'center',
      padding: 20,
      color: darkBlue,
      fontSize: 24,
      fontWeight: 300,
    },
    itemContainer: {
      paddingLeft: 15,
      padding: 5,
    },
    status: {
      fontSize: 13,
      color: '#aaa',
      marginLeft: 3,
    },
    text: {
      padding: 7,
    },
    item: {
      flexFlow: 'row',
      fontSize: 17,
      pointer: 'default',
      color: '#333',
      fontWeight: 300,
      alignItems: 'center',
      opacity: 0.8,
    },
    icon: {
      opacity: 0.8,
      marginLeft: 20,
    },
    text: {
      padding: [16, 0, 14, 10],
    },
    notFirst: {
      borderTop: `1px solid ${lightBlue}`,
    },
  }
}

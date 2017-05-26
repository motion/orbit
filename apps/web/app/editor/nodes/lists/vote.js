import React from 'react'
import { view, computed } from '~/helpers'
import App, { Document } from '@jot/models'
import { Button, Glow, Loading, Icon } from '~/ui'
import { isEqual, sortBy } from 'lodash'
import Router from '~/router'
// nice oxford commas for votes
import listify from 'listify'
import { without, includes } from 'lodash'

class VoteStore {
  // https://medium.com/hacking-and-gonzo/how-hacker-news-ranking-algorithm-works-1d9b0cf2c08d
  score = (doc, votes) => {
    const points = (votes[doc._id] || []).length
    const hours = (+Date.now() - +new Date(doc.createdAt)) / 1000 / 60
    const gravity = 1.8

    return points / Math.pow(hours + 2, gravity)
  }

  newDocument = async () => {
    const { listStore } = this.props

    listStore.createDoc({
      title: 'New Document',
    })
  }

  onVote = _id => {
    const { node: { data }, setData } = this.props

    const votes = Object.assign({}, data.get('votes') || {})
    const voters = votes[_id] || []
    votes[_id] = includes(voters, App.user.name)
      ? without(voters, App.user.name)
      : [...voters, App.user.name]

    setData(data.set('votes', votes))
  }
}

const lightBlue = '#e7f6ff'
const darkBlue = `#0099e5`

@view.attach('layoutStore')
@view({
  store: VoteStore,
})
export default class VotesList {
  votesText = votes => {
    const plural = (s, i) => s + (i === 1 ? '' : 's')
    return `${votes.length} ${plural('vote', votes.length)} by ${listify(votes)}`
  }

  render({
    listStore,
    node: { data },
    layoutStore,
    editorStore,
    editing,
    store,
    children,
    ...props
  }) {
    console.log('layout is', layoutStore)
    const hasLoaded = !!listStore.docs
    const hasDocs = hasLoaded && listStore.docs.length > 0
    const votes = data.get('votes') || {}
    const showNoDocs = hasLoaded && !hasDocs

    return (
      <container contentEditable={false}>
        <top $$row>
          <right if={!showNoDocs}>
            <Button icon="simple-add" onClick={() => layoutStore.createDoc()}>
              create document
            </Button>
          </right>
        </top>
        <list>
          <loading if={!hasLoaded}><Loading $loading /></loading>
          <noDocs if={showNoDocs}>
            <text>no documents</text>
            <Button icon="simple-add" onClick={() => layoutStore.createDoc()}>
              create document
            </Button>
          </noDocs>
          <docs if={hasLoaded && hasDocs}>
            {sortBy(listStore.docs || [], [doc => store.score(doc, votes)])
              .reverse()
              .slice(0, 10)
              .map((doc, index) => (
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
                  <status if={(votes[doc._id] || []).length > 0}>
                    {this.votesText(votes[doc._id] || [])}
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

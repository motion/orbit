import { view } from '@mcro/black'
import * as UI from '@mcro/ui'
import { isNumber } from 'lodash'
import PaneCard from './views/card'

const items = [
  {
    label: 'Assignees',
    value: 'No one assigned',
  },
  {
    label: 'Labels',
    value: 'None yet',
  },
  {
    label: 'Milestone',
    value: 'No milestone',
  },
  /*
  {
    label: 'Type',
    value: 'Epic',
    icon: 'tag',
    background: '#5F95F7',
  },
  {
    label: 'Priority',
    value: 'High',
    icon: 'alert',
    background: '#FF9140',
  },
  {
    label: 'Status',
    value: 'TODO',
    icon: 'status',
  },
  {
    label: 'Assignee',
    value: 'Unassigned',
    icon: 'person',
  },
  {
    label: 'Project',
    value: 'Prod Release 2',
    icon: 'space',
  },
  */
]

const SelectableSection = ({ index, activeIndex, ...props }) =>
  <section
    {...props}
    css={{ background: activeIndex === index ? [0, 0, 0, 0.1] : null }}
  />

const badgeProps = item =>
  item.background ? { background: item.background, color: '#fff' } : {}

@view
class Reply {
  render({ author, when, activeIndex, text, index }) {
    const image = author === 'Nate' ? 'me' : author.toLowerCase()
    return (
      <SelectableSection index={index} activeIndex={activeIndex}>
        <reply $$row>
          <img $avatar src={`/images/${image}.jpg`} />
          <bubble>
            <info $$row>
              <name>
                {author}
              </name>
              <when>
                {when}
              </when>
            </info>
            <UI.Text $content>
              {text}
            </UI.Text>
          </bubble>
        </reply>
      </SelectableSection>
    )
  }

  static style = {
    reply: {
      padding: [7, 5],
      width: '100%',
      borderTop: '1px solid #eee',
    },
    avatar: {
      width: 30,
      height: 30,
      borderRadius: 100,
      marginRight: 10,
      marginTop: 10,
    },
    info: {
      marginTop: 5,
      justifyContent: 'space-between',
    },
    bubble: {
      flex: 1,
    },
    content: {
      marginTop: 3,
    },
    when: {
      opacity: 0.7,
    },
  }
}

@view
class MetaItem {
  render({ label, value }) {
    return (
      <item>
        <name>
          {label}
        </name>
        <value>
          {value}
        </value>
      </item>
    )
  }

  static style = {
    name: {
      fontWeight: 500,
    },
  }
}

@view({
  store: class TaskStore {
    response = ''
  },
})
export default class BarTaskPane {
  getLength = () => 5
  render({ highlightIndex, activeIndex, store, paneProps }) {
    const commentButtonActive = store.response.trim().length > 0

    return (
      <PaneCard
        id="609"
        title="Create a Helm chart to deploy CouchDB on K8s"
        icon="github"
      >
        <SelectableSection $meta index={0} activeIndex={activeIndex}>
          <metaInfo $$row>
            {items.map(item => <MetaItem {...item} />)}
          </metaInfo>

          <UI.List
            if={false}
            background="transparent"
            itemProps={paneProps.itemProps}
            selected={isNumber(activeIndex) ? activeIndex : highlightIndex}
            items={items}
          />
        </SelectableSection>

        <Reply
          index={1}
          activeIndex={activeIndex}
          when="six days ago"
          author="Nick"
          text={
            <div>
              helm install stable/couchdb should stand up a working CouchDB
              deployment in my Kubernetes environment.
              <br />
              <UI.Title size={1.2}>Current Behavior</UI.Title>
              Installing CouchDB in Kubernetes is currently a very manual task.
            </div>
          }
        />

        {[0].map((v, index) =>
          <Reply
            index={index + 2}
            activeIndex={activeIndex}
            when="three days ago"
            author="Nate"
            text={
              <div>
                This is a question, sorry if this is the wrong place to ask it!
                <break />
                I believe that NodeList.forEach is in the WhatWG DOM spec, but
                is not polyfilled by the Babel polyfill. <break />This makes
                sense because the Babel polyfill is for JavaScript language
                built-ins, not Web APIs. Is there a suggestion for what polyfill
                folks should use for DOM built-ins?
              </div>
            }
          />
        )}
        <comment>
          <textarea
            $response
            value={store.response}
            onChange={e => (store.response = e.target.value)}
            placeholder="Leave a comment"
          />
          <info $$row>
            <shortcut $bright={commentButtonActive}>cmd+enter to post</shortcut>
            <UI.Button disabled={!commentButtonActive} icon="send">
              comment
            </UI.Button>
          </info>
        </comment>
      </PaneCard>
    )
  }

  static style = {
    metaInfo: {
      justifyContent: 'space-between',
      margin: [5, 40],
    },
    break: {
      height: 8,
      width: '100%',
    },
    label: {
      width: '35%',
      textAlign: 'right',
    },
    subtitle: {
      margin: [5, 0, 0],
      opacity: 0.6,
    },
    primary: {
      flexFlow: 'row',
      alignItems: 'center',
    },
    info: {
      marginTop: 5,
      justifyContent: 'space-between',
    },
    shortcut: {
      alignSelf: 'center',
      marginLeft: 5,
      opacity: 0.4,
    },
    bright: {
      opacity: 0.7,
    },
    response: {
      marginTop: 5,
      background: '#fafbfc',
      border: '1px solid rgb(209, 213, 218)',
      width: '100%',
      height: 80,
      borderRadius: 5,
      padding: 10,
      fontSize: 14,
    },
  }
}

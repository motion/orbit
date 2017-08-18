import { view } from '@mcro/black'
import * as UI from '@mcro/ui'
import { isNumber } from 'lodash'
import PaneCard from './views/card'

const items = [
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
]

const SelectableSection = ({ index, activeIndex, ...props }) =>
  <section
    {...props}
    css={{ background: activeIndex === index ? [0, 0, 0, 0.1] : null }}
  />

const badgeProps = item =>
  item.background ? { background: item.background, color: '#fff' } : {}

@view({
  store: class TaskStore {
    response = ''
  },
})
export default class BarTaskPane {
  getLength = () => 5
  render({ highlightIndex, activeIndex, store, paneProps }) {
    console.log('active index is', activeIndex)
    return (
      <PaneCard
        id="609"
        title="Create a Helm chart to deploy CouchDB using
                  Kubernetes"
        icon="github"
      >
        <SelectableSection $meta index={0} activeIndex={activeIndex}>
          <UI.Grid columns={2}>
            {items.map((item, index) =>
              <UI.ListItem
                key={index}
                primary={
                  <primary>
                    <UI.Text $label>{item.label}:</UI.Text>{' '}
                    <UI.Badge {...badgeProps(item)}>{item.value}</UI.Badge>
                  </primary>
                }
              />
            )}
          </UI.Grid>

          <UI.List
            if={false}
            background="transparent"
            itemProps={paneProps.itemProps}
            selected={isNumber(activeIndex) ? activeIndex : highlightIndex}
            items={items}
          />
        </SelectableSection>

        <SelectableSection $content index={1} activeIndex={activeIndex}>
          <UI.Title $subtitle size={1}>
            Description
          </UI.Title>
          <UI.Title size={1.2}>Expected Behavior</UI.Title>
          <UI.Text>
            helm install stable/couchdb should stand up a working CouchDB
            deployment in my Kubernetes environment.
          </UI.Text>
          <UI.Title size={1.2}>Current Behavior</UI.Title>
          <UI.Text>
            Installing CouchDB in Kubernetes is currently a very manual task.
            Many of our users...
          </UI.Text>
          <more>Show more...</more>
        </SelectableSection>

        <UI.Title $subtitle size={1}>
          Replies (30)
        </UI.Title>
        {[0, 1, 2].map((v, index) =>
          <SelectableSection
            $content
            index={2 + index}
            activeIndex={activeIndex}
          >
            <reply css={{ flexFlow: 'row', flex: 1, overflow: 'hidden' }}>
              <img
                css={{
                  width: 40,
                  height: 40,
                  borderRadius: 100,
                  marginRight: 10,
                }}
                src="/images/me.jpg"
              />
              <UI.Text>
                Helm install stable/couchdb should stand up a working CouchDB
                deployment in my Kubernetes environment.
              </UI.Text>
            </reply>
          </SelectableSection>
        )}
        <comment>
          <textarea
            $response
            value={store.response}
            onChange={e => (store.response = e.target.value)}
            placeholder="Leave a comment"
          />
          <info $$row>
            <shortcut>cmd+enter to post</shortcut>
            <UI.Button
              disabled={store.response.trim().length === 0}
              icon="send"
            >
              comment
            </UI.Button>
          </info>
        </comment>
      </PaneCard>
    )
  }

  static style = {
    meta: {
      margin: [-5, -10],
      padding: [5, 0],
      borderBottom: [1, [0, 0, 0, 0.05]],
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
    content: {
      padding: [10],
    },
    info: {
      marginTop: 5,
      justifyContent: 'space-between',
    },
    shortcut: {
      alignSelf: 'center',
      marginLeft: 5,
      opacity: 0.7,
    },
    response: {
      marginTop: 5,
      background: '#fafbfc',
      border: '1px solid rgb(209, 213, 218)',
      width: '100%',
      height: 150,
      borderRadius: 5,
      padding: 10,
      fontSize: 14,
    },
  }
}

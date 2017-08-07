import { view } from '@mcro/black'
import * as UI from '@mcro/ui'
import { isNumber } from 'lodash'

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

@view
export default class BarTaskPane {
  render({ highlightIndex, activeIndex, paneProps }) {
    return (
      <card>
        <UI.Theme name="light">
          <task>
            <heading>
              <headingcontent>
                <UI.Title display="block" size={1.5}>
                  <span>#609</span> Create a Helm chart to deploy CouchDB using
                  Kubernetes
                </UI.Title>
                <UI.Icon
                  css={{ marginTop: 10, marginLeft: 20 }}
                  size={30}
                  name="github"
                />
              </headingcontent>
            </heading>

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
                Installing CouchDB in Kubernetes is currently a very manual
                task. Many of our users...
              </UI.Text>
              <more>Show more...</more>
            </SelectableSection>

            <SelectableSection $content index={2} activeIndex={activeIndex}>
              <UI.Title $subtitle size={1}>
                Replies (20)
              </UI.Title>
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
          </task>
        </UI.Theme>
      </card>
    )
  }

  static style = {
    card: {
      flex: 1,
      padding: 8,
      margin: [5, 0],
      background: [250, 250, 250, 1],
      //borderRadius: 5,
      maxHeight: 500,
      overflowY: 'scroll',
      boxShadow: [[0, 0, 0, 2, [0, 0, 0, 0.1]]],
    },
    task: {
      flex: 1,
    },
    heading: {
      borderBottom: [1, [0, 0, 0, 0.05]],
      paddingBottom: 5,
      marginBottom: 5,
      padding: [0, 10],
      width: '100%',
      overflow: 'hidden',
    },
    headingcontent: {
      flex: 1,
      flexFlow: 'row',
      alignItems: 'flex-start',
      justifyContent: 'space-between',
      width: '100%',
    },
    meta: {
      margin: [-5, -10],
      padding: [5, 0],
      borderBottom: [1, [0, 0, 0, 0.05]],
    },
    label: {
      width: '35%',
      textAlign: 'right',
    },
    span: {
      padding: [2, 4],
      margin: [-2, -2],
      borderRadius: 5,
      background: [255, 255, 255, 0.1],
      fontSize: 16,
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
  }
}

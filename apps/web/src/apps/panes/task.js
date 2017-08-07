import { view } from '@mcro/black'
import * as UI from '@mcro/ui'
import { isNumber } from 'lodash'

@view
export default class BarTaskPane {
  render({ highlightIndex, activeIndex, paneProps }) {
    return (
      <task>
        <heading>
          <UI.Title size={1.8}>
            <UI.Button inline>#609</UI.Button> Create a Helm chart to deploy
            CouchDB using Kubernetes
          </UI.Title>
          <UI.Icon
            css={{ marginTop: 10, marginLeft: 20 }}
            size={30}
            name="github"
          />
        </heading>

        <meta>
          <UI.List
            itemProps={paneProps.itemProps}
            selected={isNumber(activeIndex) ? activeIndex : highlightIndex}
            items={[
              { primary: 'Type: Epic', icon: 'test' },
              { primary: 'Priority: High', icon: 'test' },
              { primary: 'Status: TODO', icon: 'test' },
              { primary: 'Assignee: Unassigned', icon: 'test' },
              { primary: 'Project: Prod Release 2', icon: 'test' },
            ]}
          />
        </meta>

        <content>
          <UI.Title size={1}>Description</UI.Title>
          <UI.Title size={1.2}>Expected Behavior</UI.Title>
          <UI.Text>
            helm install stable/couchdb should stand up a working CouchDB
            deployment in my Kubernetes environment.
          </UI.Text>
          <UI.Title size={1.2}>Current Behavior</UI.Title>
          <UI.Text>
            Installing CouchDB in Kubernetes is currently a very manual task.
            Many of our users are starting to adopt Kubernetes in their
            environments and are working through these details themselves.
          </UI.Text>
          <UI.Title size={1.2}>Possible Solution</UI.Title>
          <UI.Text>
            See https://github.com/kubernetes/charts/blob/master/CONTRIBUTING.md
            for the process to add a new chart to the Helm repository.
          </UI.Text>
        </content>
      </task>
    )
  }

  static style = {
    task: {
      flex: 1,
    },
    heading: {
      flexFlow: 'row',
      alignItems: 'flex-start',
      justifyContent: 'space-between',
      flex: 1,
      overflow: 'hidden',
      borderBottom: [1, [0, 0, 0, 0.05]],
      paddingBottom: 5,
      marginBottom: 5,
      padding: [0, 10],
    },
    meta: {
      // margin: [0, -20],
    },
  }
}

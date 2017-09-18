import { view } from '@mcro/black'
import * as UI from '@mcro/ui'
import * as Pane from '../pane'

@view
class BarContents {
  render() {
    return (
      <contents $$row>
        <UI.Icon size={20} name="github" />
        <label>Orbit</label>
        <arrow>→</arrow>
        <label>New Issue</label>
      </contents>
    )
  }

  static style = {
    contents: {
      alignItems: 'center',
      color: '#eee',
    },
    arrow: {
      fontSize: 20,
    },
    label: {
      marginLeft: 10,
      marginRight: 10,
      fontWeight: 600,
      fontSize: 18,
    },
  }
}

@view.provide({
  // paneStore: Pane.Store,
  store: class CodeStore {
    children = null

    newTitle = ''
    content = ''

    barContents = <BarContents />
  },
})
@view
export default class NewIssue {
  render({ data, store }) {
    return (
      <Pane.Card light>
        <UI.Theme color="dark">
          <container>
            <top $$row>
              <UI.Input
                value={store.newTitle}
                placeholder="New Issue"
                onChange={e => (store.newTitle = e.target.value)}
                $title
              />
              <Pane.Actions
                id="paneActions"
                color="#333"
                actions={['assign', 'milestone', 'label']}
              />
            </top>
            <content>
              <textarea
                value={store.content}
                onChange={e => (store.content = e.target.value)}
              />
              <buttons>
                <UI.Button color="#333">Submit</UI.Button>
              </buttons>
            </content>
          </container>
        </UI.Theme>
      </Pane.Card>
    )
  }

  static style = {
    container: {
      padding: 10,
    },
    title: {
      maxWidth: 600,
      color: '#333',
    },
    content: {
      marginTop: 20,
    },
    buttons: {
      alignSelf: 'flex-end',
      width: 100,
      marginTop: 5,
    },
    textarea: {
      flex: 1,
      width: '100%',
      height: 300,
      fontSize: 14,
      padding: 10,
    },
    top: {
      justifyContent: 'space-between',
    },
    left: {
      alignItems: 'center',
    },
    avatar: {
      width: 30,
      height: 30,
      borderRadius: 30,
    },
    h3: {
      marginLeft: 10,
    },
  }
}

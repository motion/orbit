import * as React from 'react'
import { view } from '@mcro/black'
import { Thing } from '~/app'
import * as UI from '@mcro/ui'
import { formatDistance } from 'date-fns'
import Pane from '../pane'
import DocSidebar from './sidebar'

@view({
  store: class DocStore {
    thing = Thing.findOne(this.props.result.id)
  },
})
class DocMain {
  getDoc() {
    const { store } = this.props
    const { title, data: { contents, modifiedTime, owners } } = store.thing
    return (
      <doc>
        <UI.Theme name="light">
          <info css={{ width: '100%', flex: 1 }}>
            <title
              $$row
              css={{
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <left $$row>
                <UI.Title
                  onClick={store.ref('isOpen').toggle}
                  size={1.4}
                  fontWeight={800}
                  color="#000"
                  marginBottom={1}
                >
                  {title}
                </UI.Title>
              </left>
              <right $$row>
                <UI.Text
                  fontWeight={300}
                  css={{ marginTop: 10, marginLeft: 20 }}
                  opacity={0.7}
                >
                  edited {formatDistance(modifiedTime, Date.now())} ago
                </UI.Text>
                <owner>
                  <UI.Text
                    fontWeight={300}
                    css={{ marginTop: 10, marginLeft: 20 }}
                    opacity={0.7}
                  >
                    owned by {(owners || []).map(o => o.displayName).join(', ')}
                  </UI.Text>
                </owner>
              </right>
            </title>
          </info>
          <content>
            <div
              dangerouslySetInnerHTML={{
                __html: contents.html,
              }}
            />
          </content>
        </UI.Theme>
      </doc>
    )
  }

  loading() {
    return (
      <doc>
        <UI.Title size={1.4} fontWeight={800} color="#000" marginBottom={1}>
          {this.props.result.title}
        </UI.Title>
      </doc>
    )
  }

  render({ store }) {
    return (
      <card>
        <UI.Theme name="light">
          <Pane
            items={[() => (store.thing ? this.getDoc() : this.loading())]}
          />
        </UI.Theme>
      </card>
    )
  }

  static style = {
    card: {
      padding: 15,
      flex: 1,
      width: '100%',
      background: '#fff',
      boxShadow: [[0, 0, 10, [0, 0, 0, 0.1]]],
      borderRadius: 3,
    },
    frame: {
      flex: 1,
      width: '100%',
      height: '100%',
    },
    docItem: {
      overflow: 'scroll',
      margin: [20, 20],
    },
    content: {
      overflow: 'scroll',
      margin: [15, 30],
    },
    div: {
      alignSelf: 'center',
      overflow: 'scroll',
      boxShadow: '1px 1px 5px rgba(0,0,0,0.3)',
      width: '100%',
      padding: 15,
      flex: 1,
    },
  }
}

export default {
  Sidebar: DocSidebar,
  Main: DocMain,
}

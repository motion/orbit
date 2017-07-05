import React from 'react'
import { view } from '@mcro/black'
import { User, Document } from '@mcro/models'
import * as UI from '@mcro/ui'
import * as Constants from '~/constants'
import DocumentView from '~/views/document'

@view({
  store: class {
    // document = Document.create({}, true)
  },
})
export default class UserBar {
  render({ store }) {
    return (
      <userbar $$draggable if={User.loggedIn}>
        <UI.Popover
          theme="light"
          openOnClick
          background
          distance={10}
          forgiveness={16}
          target={
            <UI.Button glowProps={{ show: true }} theme="dark">
              Status | 👋
            </UI.Button>
          }
          openOnHover
          closeOnClick
        >
          <DocumentView if={store.document} document={store.document} />
        </UI.Popover>
        <div $$flex />
        <UI.Text style={{ marginRight: 10 }} ellipse>
          {User.name}
        </UI.Text>
        <UI.Popover
          theme="light"
          background="transparent"
          distance={10}
          forgiveness={16}
          delay={130}
          target={<UI.Button theme="dark" circular icon="body" />}
          openOnHover
          closeOnClick
        >
          <UI.List
            background
            elevation={3}
            width={150}
            padding={3}
            borderRadius={6}
            itemProps={{
              height: 32,
              fontSize: 14,
              borderWidth: 0,
              borderRadius: 8,
            }}
            items={[
              {
                icon: 'body',
                primary: User.name,
                after: (
                  <UI.Button
                    size={0.8}
                    icon="power"
                    onClick={() => User.logout()}
                  />
                ),
              },
              {
                icon: 'gear',
                primary: 'Settings',
                onClick: () => console.log(),
              },
            ]}
          />
        </UI.Popover>
      </userbar>
    )
  }

  static style = {
    userbar: {
      flexFlow: 'row',
      alignItems: 'center',
      justifyContent: 'flex-end',
      padding: [0, 6],
      height: Constants.HEADER_HEIGHT,
      position: 'relative',
    },
  }
}

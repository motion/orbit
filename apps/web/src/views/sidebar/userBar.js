import React from 'react'
import { view } from '@mcro/black'
import { User, Document } from '@mcro/models'
import * as UI from '@mcro/ui'
import * as Constants from '~/constants'
import DocumentView from '~/views/document'

@view({
  store: class {
    document = Document.create({}, true)
  },
})
export default class UserBar {
  render({ store }) {
    return (
      <userbar $$draggable if={User.loggedIn}>
        <UI.Popover
          openOnClick
          background
          delay={150}
          borderRadius={8}
          elevation={2}
          distance={10}
          forgiveness={16}
          width={400}
          target={<UI.Button chromeless icon="hotelbell" />}
          openOnHover
          closeOnClick
          theme="dark"
        >
          <notification>
            <author>Matt</author> said{' '}
            <quote>"something about something else"</quote>{' '}
            <date>3 min ago</date>
          </notification>
          <DocumentView if={store.document} document={store.document} inline />
        </UI.Popover>
        <div $$flex />
        <UI.Text style={{ marginRight: 10 }} ellipse>
          {User.name}
        </UI.Text>
        <UI.Popover
          background="transparent"
          distance={10}
          elevation={5}
          borderRadius={8}
          forgiveness={16}
          delay={150}
          target={<UI.Button circular icon="body" />}
          openOnHover
          closeOnClick
        >
          <UI.List
            background
            css={{
              backdropFilter: 'blur(2px)',
            }}
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
      // background: [0, 0, 0, 0.1],
    },
    notification: {
      padding: 10,
      flexFlow: 'row',
    },
  }
}

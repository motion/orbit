import React from 'react'
import { view } from '@mcro/black'
import { User, Document } from '@mcro/models'
import * as UI from '@mcro/ui'
import * as Constants from '~/constants'
import Inbox from '~/views/inbox'

@view({
  store: class {
    document = Document.create({}, true)
  },
})
export default class UserBar {
  render({ store }) {
    return (
      <userbar $$draggable if={User.loggedIn}>
        <above
          css={{
            position: 'absolute',
            bottom: 10,
            left: 10,
            flexFlow: 'row',
          }}
        >
          {['Allie', 'Jackie', 'Evenie'].map((text, i) =>
            <UI.Popover
              key={i}
              openOnHover
              background
              theme="dark"
              borderRadius={5}
              elevation={3}
              target={
                <UI.Circle
                  size={24}
                  marginRight={5}
                  zIndex={100 - i}
                  background="linear-gradient(#eee, #fff 50%)"
                  fontSize={20}
                  color="white"
                  overflow="hidden"
                  boxShadow={[
                    [0, 0, 2, [0, 0, 0, 0.1]],
                    ['inset', 0, 0, 0, 1, [0, 0, 0, 0.05]],
                  ]}
                  transition="transform ease-in 30ms"
                  transform={{
                    scale: 1.0,
                  }}
                  {...{
                    '&:hover': {
                      transform: {
                        scale: 1.1,
                      },
                    },
                  }}
                >
                  <UI.Glint borderRadius={1000} />
                </UI.Circle>
              }
            >
              <Inbox />
            </UI.Popover>
          )}
        </above>
        <div $$flex />
        <UI.Text style={{ marginRight: 10 }} ellipse>
          {User.name}
        </UI.Text>
        <UI.Popover
          distance={10}
          elevation={5}
          borderRadius={8}
          forgiveness={16}
          delay={150}
          target={<UI.Button circular icon="body" />}
          openOnHover
          closeOnClick
          theme="dark"
          debug
        >
          <UI.List
            background="transparent"
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

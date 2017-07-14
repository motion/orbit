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
          if={User.favoriteDocuments}
          css={{
            position: 'absolute',
            bottom: 10,
            left: 10,
            flexFlow: 'row',
          }}
        >
          <fade if={false} $$fullscreen css={{ left: 'auto', width: 50 }}>
            <fadeout $fadeamt={1} />
            <fadeout $fadeamt={2} />
            <fadeout $fadeamt={3} />
            <fadeout $fadeamt={4} />
            <fadeout $fadeamt={5} />
            <fadeout $fadeamt={6} />
            <fadeout $fadeamt={7} />
            <fadeout $fadeamt={8} />
            <fadeout $fadeamt={9} />
            <fadeout $fadeamt={10} />
          </fade>
          {User.favoriteDocuments.map((text, i) =>
            <UI.Popover
              key={i}
              openOnHover
              background
              theme="dark"
              borderRadius={5}
              elevation={2}
              target={
                <UI.Circle
                  size={24}
                  marginRight={3}
                  zIndex={100 - i}
                  background={[0, 0, 0, 0.1]}
                  fontSize={20}
                  color="white"
                  overflow="hidden"
                  transition="transform ease-in 30ms"
                  transform={{
                    scale: 1.0,
                  }}
                />
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
          elevation={2}
          borderRadius={8}
          forgiveness={16}
          delay={150}
          target={<UI.Button circular icon="body" />}
          openOnHover
          closeOnClick
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
    fadeout: {
      position: 'absolute',
      top: 0,
      bottom: 0,
      zIndex: 1000,
    },
    fadeamt: step => ({
      backdropFilter: `opacity(${step * 10}%)`,
      right: step * 3,
      width: 3,
    }),
  }
}

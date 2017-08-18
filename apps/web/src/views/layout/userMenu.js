import React from 'react'
import { view } from '@mcro/black'
import { CurrentUser, Thing, Org, Image } from '~/app'
import * as UI from '@mcro/ui'
import * as Constants from '~/constants'

@view
export default class UserMenu {
  render({ children }) {
    return (
      <usermenu if={CurrentUser.loggedIn}>
        <UI.Popover
          distance={10}
          elevation={2}
          borderRadius={8}
          forgiveness={16}
          delay={150}
          theme="light"
          target={
            children ||
            <UI.Button chromeless icon="gear" iconAfter>
              {CurrentUser.name}
            </UI.Button>
          }
          openOnHover
          closeOnClick
        >
          <UI.List
            width={150}
            padding={3}
            borderRadius={6}
            itemProps={{
              height: 32,
              fontSize: 14,
              borderRadius: 8,
            }}
            items={[
              {
                icon: 'body',
                primary: CurrentUser.name,
                ellipse: true,
                after: (
                  <UI.Button
                    size={0.8}
                    icon="power"
                    onClick={() => CurrentUser.logout()}
                  />
                ),
              },
              {
                icon: 'gear',
                primary: 'Settings',
                onClick: () => console.log(),
              },
              {
                icon: 'ice',
                primary: 'Destroy All',
                onClick: () => {
                  console.log('destroying all')
                  ;[Thing, Org, Image].forEach(async model => {
                    const all = await model.find().exec()
                    log('removing', model.title)
                    if (all && all.length) {
                      all.map(item => item.remove())
                    }
                  })
                },
              },
            ]}
          />
        </UI.Popover>
      </usermenu>
    )
  }

  static style = {
    usermenu: {
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

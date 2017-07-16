import React from 'react'
import { view } from '@mcro/black'
import { User, Document, Org, Image } from '@mcro/models'
import * as UI from '@mcro/ui'
import * as Constants from '~/constants'

@view
export default class UserBar {
  render() {
    return (
      <userbar $$draggable if={User.loggedIn}>
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
          target={
            <UI.Button circular chromeless icon="circle-09" sizeIcon={1.7} />
          }
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
              borderRadius: 8,
            }}
            items={[
              {
                icon: 'body',
                primary: User.name,
                ellipse: true,
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
              {
                icon: 'fire',
                primary: 'Destroy All',
                onClick: () => {
                  ;[Document, Org, Image].forEach(async model => {
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

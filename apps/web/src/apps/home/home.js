import * as React from 'react'
import { view } from '@mcro/black'
import * as UI from '@mcro/ui'
import HomeStore from './homeStore'
import Main from './main'
import Sidebar from './sidebar'

const inputStyle = {
  fontWeight: 200,
  color: '#fff',
  fontSize: 30,
}

@view.provide({
  homeStore: HomeStore,
})
@view
export default class HomePage {
  render({ homeStore }) {
    return (
      <UI.Theme name="clear-dark">
        <home ref={homeStore.ref('barRef').set} $$fullscreen>
          <header $$draggable>
            <UI.Icon
              $searchIcon
              size={18}
              name="zoom"
              color={[255, 255, 255, 0.1]}
            />
            <UI.Input
              $searchInput
              onClick={homeStore.onClickInput}
              size={1.8}
              getRef={homeStore.onInputRef}
              borderRadius={0}
              onChange={homeStore.onSearchChange}
              value={homeStore.textboxVal}
              borderWidth={0}
              fontWeight={200}
              css={inputStyle}
            />
            <dock
              css={{
                position: 'absolute',
                top: 0,
                right: 20,
                bottom: 0,
                alignItems: 'center',
                flexFlow: 'row',
              }}
            >
              <UI.Row spaced>
                <UI.Button theme="clear-dark" borderRadius={500}>
                  Welcome, Matt
                </UI.Button>
              </UI.Row>
            </dock>

            <dock
              if={false}
              css={{
                position: 'absolute',
                top: 0,
                right: 20,
                bottom: 0,
                alignItems: 'center',
                flexFlow: 'row',
              }}
            >
              <UI.Row spaced>
                {(homeStore.myrecent || []).map(item => (
                  <wrap
                    key={item.id}
                    css={{ position: 'relative', marginLeft: 15 }}
                  >
                    <UI.Button
                      circular
                      chromeless
                      key={item.id}
                      size={2}
                      iconSize={36}
                      icon={`social${item.integration}`}
                      iconProps={{
                        color: ['yellow', 'darkorange', 'purple', 'darkblue'][
                          Math.floor(Math.random() * 5)
                        ],
                        style: {
                          marginTop: -14,
                        },
                      }}
                      glow
                      badge={`#${item.data.number}`}
                    />
                    <UI.Text
                      ellipse
                      size={0.8}
                      fontWeight={200}
                      opacity={0.6}
                      css={{
                        textAlign: 'center',
                        position: 'absolute',
                        bottom: 0,
                        left: 0,
                        right: 0,
                      }}
                    >
                      {item.title}
                    </UI.Text>
                  </wrap>
                ))}
              </UI.Row>
            </dock>
            <forwardcomplete>
              <fwdcontents>{homeStore.peekItem}</fwdcontents>
            </forwardcomplete>
          </header>
          <content>
            <Sidebar homeStore={homeStore} />
            <Main homeStore={homeStore} />
          </content>
        </home>
      </UI.Theme>
    )
  }

  static style = {
    home: {
      background: [120, 120, 120, 0.75],
      flex: 1,
    },
    content: {
      flexFlow: 'row',
      flex: 1,
      position: 'relative',
    },
    header: {
      position: 'relative',
      height: 70,
      marginTop: -1,
    },
    searchIcon: {
      position: 'absolute',
      top: 3,
      bottom: 0,
      alignItems: 'center',
      height: 'auto',
      left: 18,
    },
    searchInput: {
      padding: [0, 20, 0, 50],
    },
    forwardcomplete: {
      position: 'absolute',
      top: 0,
      bottom: 0,
      alignItems: 'center',
      justifyContent: 'center',
      left: 50,
      opacity: 0,
      ...inputStyle,
      zIndex: -1,
      pointerEvents: 'none',
    },
    fwdcontents: {
      marginTop: 1,
    },
  }
}

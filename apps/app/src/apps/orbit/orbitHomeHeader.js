import * as React from 'react'
import { view } from '@mcro/black'
import * as UI from '@mcro/ui'

@UI.injectTheme
@view
export class OrbitHomeHeader {
  render({ paneStore, theme }) {
    const buttonColor = theme.base.color.lighten(0.2)
    const exploreButton = {
      size: 1.2,
      circular: true,
      borderWidth: 1,
      margin: [0, 0, 0, 5],
      borderColor: 'transparent',
      background: 'transparent',
      iconProps: {
        color: buttonColor,
        size: 15,
      },
      opacity: 0.3,
      activeStyle: {
        background: 'transparent',
        borderColor: '#ddd',
        opacity: 0.7,
      },
      hoverStyle: {
        background: 'transparent',
      },
    }
    return (
      <>
        <section $explore>
          <UI.Button
            icon="home"
            tooltip="Home"
            $exploreButton
            active={paneStore.activePane === 'home'}
            onClick={() => paneStore.setActivePane('home')}
            {...exploreButton}
          />
          <UI.Button
            icon="menu35"
            tooltip="Directory"
            $exploreButton
            active={paneStore.activePane === 'directory'}
            onClick={() => paneStore.setActivePane('directory')}
            {...exploreButton}
          />
          <UI.Button
            if={false}
            icon="gear"
            tooltip="Settings"
            $exploreButton
            sizeIcon={1.2}
            active={paneStore.activePane === 'settings'}
            onClick={() => paneStore.setActivePane('settings')}
            {...exploreButton}
          />
          {/* <space $$flex />
          <filters>
            {paneStore.filters.map((name, index) => (
              <RoundButton
                {...roundBtnProps}
                key={index}
                active={paneStore.paneIndex === index - paneStore.mainPanes}
                onClick={() => paneStore.setActivePane(name)}
              >
                {name}
              </RoundButton>
            ))}
            <RoundButton
              {...roundBtnProps}
              sizePadding={1.3}
              icon="arrowsmalldown"
              iconProps={{
                color: theme.active.background.darken(0.15),
                style: { marginTop: 3 },
              }}
            />
          </filters> */}
        </section>
      </>
    )
  }

  static style = {
    explore: {
      width: '100%',
      flexFlow: 'row',
      padding: [7, 0, 10, 12],
      alignItems: 'center',
    },
    filters: {
      flexFlow: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      opacity: 0.5,
      '&:hover': {
        opacity: 1,
      },
    },
  }
}

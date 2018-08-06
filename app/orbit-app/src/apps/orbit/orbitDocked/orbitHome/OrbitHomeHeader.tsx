import * as React from 'react'
import { view, attachTheme } from '@mcro/black'
import * as UI from '@mcro/ui'
import { PaneManagerStore } from '../../PaneManagerStore'
import { ThemeObject } from '@mcro/gloss'

const Section = view('section', {
  width: '100%',
  flexFlow: 'row',
  padding: [0, 6, 0, 12],
  alignItems: 'center',
})

type Props = {
  paneManagerStore: PaneManagerStore
  theme?: ThemeObject
}

const exploreButton = {
  size: 1.1,
  circular: true,
  borderWidth: 1,
  margin: [0, 0, 0, 2],
  borderColor: 'transparent',
  background: 'transparent',
  transform: {
    y: -0.5,
  },
  iconProps: {
    color: 'black',
    size: 12,
  },
  opacity: 0.35,
  activeStyle: {
    color: '#000',
    background: 'transparent',
    borderColor: 'transparent',
    opacity: 1,
  },
  hoverStyle: {
    background: 'transparent',
    borderColor: 'transparent',
    opacity: 1,
  },
}

@attachTheme
@view
export class OrbitHomeHeader extends React.Component<Props> {
  render() {
    const { paneManagerStore, theme } = this.props
    const buttonColor = theme.base.color.lighten(0.2)
    exploreButton.iconProps.color = buttonColor
    const homeActive =
      paneManagerStore.activePane === 'home' ||
      paneManagerStore.activePane === 'search'
    return (
      <>
        <Section>
          {!homeActive && (
            <UI.Button
              icon="home"
              tooltip="Home"
              active={homeActive}
              onClick={() => paneManagerStore.setActivePane('home')}
              {...exploreButton}
            />
          )}
          <UI.Button
            debug
            icon="menu35"
            tooltip="Directory"
            active={paneManagerStore.activePaneFast === 'directory'}
            onClick={() => paneManagerStore.setActivePane('directory')}
            {...exploreButton}
          />
          <UI.Button
            debug
            icon="gear"
            tooltip="Settings"
            sizeIcon={1.2}
            active={paneManagerStore.activePaneFast === 'settings'}
            onClick={() => paneManagerStore.setActivePane('settings')}
            {...exploreButton}
          />
          {/*
          <filters>
            {paneManagerStore.filters.map((name, index) => (
              <RoundButton
                {...roundBtnProps}
                key={index}
                active={paneManagerStore.paneIndex === index - paneManagerStore.mainPanes}
                onClick={() => paneManagerStore.setActivePane(name)}
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
        </Section>
      </>
    )
  }
}

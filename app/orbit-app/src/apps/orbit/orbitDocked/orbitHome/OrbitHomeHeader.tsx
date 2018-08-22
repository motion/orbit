import * as React from 'react'
import { view } from '@mcro/black'
import * as UI from '@mcro/ui'
import { PaneManagerStore } from '../../PaneManagerStore'
import { ThemeObject, attachTheme } from '@mcro/gloss'

const Section = view('section', {
  width: '100%',
  flexFlow: 'row',
  padding: [0, 6, 0, 12],
  alignItems: 'center',
  transition: 'all ease 500ms',
  transform: {
    y: -0.5,
  },
  invisible: {
    opacity: 0,
    pointerEvents: 'none',
  },
})

type Props = {
  paneManagerStore: PaneManagerStore
  theme?: ThemeObject
}

const exploreButton = {
  size: 1.3,
  circular: true,
  glint: false,
  borderWidth: 0,
  borderColor: 'transparent',
  background: 'transparent',
  opacity: 0.35,
  transform: {
    y: -0.5,
  },
  iconProps: {
    size: 12,
  },
  hoverStyle: {
    opacity: 0.6,
  },
  activeStyle: {
    opacity: 1,
  },
}

@attachTheme
@view
export class OrbitHomeHeader extends React.Component<Props> {
  render() {
    const { paneManagerStore, theme } = this.props
    const buttonColor = theme.color.lighten(0.2)
    exploreButton.iconProps.color = buttonColor
    const homeActive =
      paneManagerStore.activePane === 'home' ||
      paneManagerStore.activePane === 'search'
    return (
      <>
        <Section invisible={paneManagerStore.activePane === 'onboard'}>
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
            icon="menu35"
            tooltip="Directory"
            active={paneManagerStore.activePaneFast === 'directory'}
            onClick={() => paneManagerStore.setActivePane('directory')}
            {...exploreButton}
          />
          <UI.Button
            icon="app"
            tooltip="Apps"
            active={paneManagerStore.activePaneFast === 'apps'}
            onClick={() => paneManagerStore.setActivePane('apps')}
            {...exploreButton}
          />
          {/* <UI.Button
            debug
            icon="gear"
            tooltip="Settings"
            sizeIcon={1.2}
            active={paneManagerStore.activePaneFast === 'settings'}
            onClick={() => paneManagerStore.setActivePane('settings')}
            {...exploreButton}
          /> */}
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
                color: theme.backgroundActive.darken(0.15),
                style: { marginTop: 3 },
              }}
            />
          </filters> */}
        </Section>
      </>
    )
  }
}

import * as React from 'react'
import { view, attachTheme } from '@mcro/black'
import * as UI from '@mcro/ui'
import { PaneManagerStore } from './PaneManagerStore'
import { ThemeObject } from '@mcro/gloss'

const Section = view('section', {
  width: '100%',
  flexFlow: 'row',
  padding: [0, 6, 0, 12],
  alignItems: 'center',
})

type Props = {
  paneStore: PaneManagerStore
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
    const { paneStore, theme } = this.props
    const buttonColor = theme.base.color.lighten(0.2)
    exploreButton.iconProps.color = buttonColor
    return (
      <>
        <Section>
          {/* <UI.Button
            icon="home"
            tooltip="Home"
            active={paneStore.activePane === 'home'}
            onClick={() => paneStore.setActivePane('home')}
            {...exploreButton}
          /> */}
          <UI.Button
            icon="menu35"
            tooltip="Directory"
            active={paneStore.activePane === 'directory'}
            onClick={() => paneStore.setActivePane('directory')}
            {...exploreButton}
          />
          <UI.Button
            icon="gear"
            tooltip="Settings"
            sizeIcon={1.2}
            active={paneStore.activePane === 'settings'}
            onClick={() => paneStore.setActivePane('settings')}
            {...exploreButton}
          />
          {/*
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
        </Section>
      </>
    )
  }
}

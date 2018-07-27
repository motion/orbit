import * as React from 'react'
import { view, attachTheme } from '@mcro/black'
import * as UI from '@mcro/ui'
import { OrbitDockedPaneStore } from './OrbitDockedPaneStore'
import { ThemeObject } from '@mcro/gloss'

const Section = view('section', {
  width: '100%',
  flexFlow: 'row',
  padding: [7, 0, 7, 12],
  alignItems: 'center',
})

type Props = {
  paneStore: OrbitDockedPaneStore
  theme?: ThemeObject
}

@attachTheme
@view
export class OrbitHomeHeader extends React.Component<Props> {
  render() {
    const { paneStore, theme } = this.props
    const buttonColor = theme.base.color.lighten(0.2)
    const exploreButton = {
      size: 1.2,
      circular: true,
      borderWidth: 1,
      margin: [0, 0, 0, 6],
      borderColor: 'transparent',
      background: 'transparent',
      iconProps: {
        color: buttonColor,
        size: 13,
      },
      opacity: 0.4,
      activeStyle: {
        background: 'transparent',
        borderColor: 'transparent',
        opacity: 1,
      },
      hover: {
        background: 'transparent',
        borderColor: [0, 0, 0, 0.3],
      },
    }
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

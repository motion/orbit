import * as React from 'react'
import { view } from '@mcro/black'
import { SubTitle, RoundButton } from '~/views'
import * as UI from '@mcro/ui'

const roundBtnProps = {
  fontSize: 15,
  sizePadding: 1.5,
  sizeHeight: 1,
  sizeRadius: 0.9,
  margin: [0, 1],
}

const postfix = [
  'st',
  'nd',
  'rd',
  'th',
  'th',
  'th',
  'th',
  'th',
  'th',
  'th',
  'th',
  'th',
  'th',
  'th',
  'th',
  'th',
  'th',
  'th',
  'th',
  'th',
  'st',
  'nd',
  'rd',
  'th',
  'th',
  'th',
  'th',
  'th',
  'th',
  'th',
  'st',
]

@UI.injectTheme
@view
export class OrbitHomeHeader {
  render({ paneStore, theme }) {
    const locale = 'en-US'
    const now = new Date()
    const day = now.toLocaleDateString(locale, { weekday: 'short' })
    const month = now.toLocaleDateString(locale, { month: 'short' })
    const dayNum = now.getMonth()
    const buttonColor = theme.base.color.darken(0.15)
    const exploreButton = {
      size: 1.2,
      circular: true,
      borderWidth: 0,
      borderColor: theme.base.borderColor,
      background: 'transparent',
      iconProps: {
        color: buttonColor,
        size: 18,
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
            icon="userscir"
            tooltip="Directory"
            $exploreButton
            active={paneStore.activePane === 'directory'}
            onClick={() => paneStore.setActivePane('directory')}
            {...exploreButton}
          />
          <UI.Button
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
        <section if={false} $subSection>
          <title>
            <SubTitle $niceDate>
              {day} {month} {dayNum}
              <span $super>{postfix[dayNum - 1]}</span>
            </SubTitle>
          </title>
          <div $$flex />
        </section>
      </>
    )
  }

  static style = {
    super: {
      verticalAlign: 'super',
      marginLeft: 1,
      fontSize: 11,
      opacity: 0.6,
    },
    cards: {
      flexFlow: 'row',
      flexWrap: 'wrap',
      userSelect: 'none',
      marginBottom: 20,
    },
    explore: {
      width: '100%',
      flexFlow: 'row',
      padding: [7, 10, 10, 12],
      alignItems: 'center',
    },
    exploreButton: {
      margin: [0, 6, 0, 0],
    },
    subSection: {
      flexFlow: 'row',
      alignItems: 'center',
      padding: [0, 15, 10],
    },
    title: {
      padding: [0, 15, 0, 0],
    },
    niceDate: {
      fontSize: 16,
      fontWeight: 300,
      lineHeight: '1.5rem',
      margin: 0,
      padding: 0,
      flexFlow: 'row',
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

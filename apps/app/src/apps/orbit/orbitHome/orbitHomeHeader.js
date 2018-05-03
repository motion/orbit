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

@view
export default class OrbitHomeHeader {
  render({ theme }) {
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
      background: theme.base.background,
      iconProps: {
        color: buttonColor,
        size: 14,
      },
    }
    return (
      <React.Fragment>
        <section $explore>
          <UI.Button
            icon="menu"
            tooltip="Explore"
            $exploreButton
            css={{ marginLeft: -2 }}
            {...exploreButton}
          />
          <UI.Button
            icon="userscir"
            tooltip="Directory"
            $exploreButton
            {...exploreButton}
          />
          <space $$flex />
          <UI.Text size={1.15} css={{ margin: [0, 15] }}>
            <span
              css={{
                paddingBottom: 2,
                borderBottom: [2, theme.active.background.lighten(0.02)],
              }}
            >
              your filters
            </span>
          </UI.Text>
        </section>

        <section $filterSection>
          <title>
            <SubTitle $subtitle>
              {day} {month} {dayNum}
              <span $super>{postfix[dayNum - 1]}</span>
            </SubTitle>
          </title>
          <div $$flex />
          <filters>
            {['all', 'general', 'status', 'showoff'].map((name, index) => (
              <RoundButton {...roundBtnProps} key={index} active={index === 0}>
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
          </filters>
        </section>
      </React.Fragment>
    )
  }

  static style = {
    super: {
      verticalAlign: 'super',
      marginLeft: 1,
      fontSize: 11,
      opacity: 0.6,
    },
    section: {
      padding: [5, 0],
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
      padding: [10, 8, 4],
      alignItems: 'center',
    },
    exploreButton: {
      margin: [0, 3, 0, 0],
    },
    filterSection: {
      flexFlow: 'row',
      alignItems: 'center',
      padding: [0, 15, 15],
    },
    title: {
      padding: [0, 15, 0, 0],
    },
    subtitle: {
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
    },
  }
}

import * as React from 'react'
import { view, attachTheme } from '@mcro/black'
import * as UI from '@mcro/ui'
import { OrbitIcon } from '../../apps/orbit/orbitIcon'

const TitleBarTitle = props => (
  <UI.Text
    size={1.3}
    fontWeight={700}
    ellipse={2}
    margin={0}
    lineHeight="1.5rem"
    {...props}
  />
)

const TitleBarContain = view({
  flex: 1,
  maxWidth: '100%',
  marginBottom: 5,
})

const TitleBarSubTitle = ({ children, date }) => (
  <UI.Text size={1} ellipse={1}>
    {children} <UI.Date>{date}</UI.Date>
  </UI.Text>
)

const TitleBar = ({ children, subtitle, date, icon, ...props }) => (
  <TitleBarContain {...props}>
    <TitleBarTitle>{children}</TitleBarTitle>
    <TitleBarSubTitle date={date}>{subtitle}</TitleBarSubTitle>
    {icon}
  </TitleBarContain>
)

@attachTheme
@view
export class PeekHeaderContent extends React.Component {
  render({ peekStore, title, date, subtitle, after, permalink, icon }) {
    return (
      <header ref={this.onHeader}>
        <TitleBar
          subTitle={subtitle}
          date={date}
          icon={
            <OrbitIcon
              if={icon}
              icon={icon}
              size={16}
              css={{
                position: 'absolute',
                top: -2,
                right: 70,
                transform: {
                  scale: 3,
                  rotate: '45deg',
                },
              }}
            />
          }
        >
          {title}
        </TitleBar>
        <after>
          <afterInner>
            <permalink if={permalink}>
              <UI.Button size={0.9} icon="link" circular onClick={permalink} />
            </permalink>
            <space if={permalink && icon} />
          </afterInner>
          {after}
        </after>
      </header>
    )
  }

  static style = {
    header: {
      flexFlow: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      position: 'relative',
      zIndex: 100,
    },
    titles: {
      marginRight: 25,
    },
    title: {
      flex: 1,
      flexFlow: 'row',
    },
    subtitle: {
      opacity: 0.8,
    },
    date: { opacity: 0.5, fontSize: 14 },
    after: {
      alignSelf: 'flex-end',
    },
    afterInner: {
      flexFlow: 'row',
      alignItems: 'center',
      position: 'relative',
    },
    space: {
      width: 7,
    },
    permalink: {
      opacity: 0.75,
    },
  }

  static theme = ({ theme }) => {
    return {
      header: {
        background: theme.base.background,
        '&:hover': {
          background: theme.active.background,
        },
      },
    }
  }
}

export const PeekHeader = view.attach('peekStore')(props => (
  <UI.Theme theme={props.peekStore.theme || false}>
    <PeekHeaderContent {...props} />
  </UI.Theme>
))

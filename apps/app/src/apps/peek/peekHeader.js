import * as React from 'react'
import { view, attachTheme } from '@mcro/black'
import * as UI from '@mcro/ui'
import { OrbitIcon } from '../../apps/orbit/orbitIcon'
import { WindowControls } from '../../views/WindowControls'
import { App } from '@mcro/stores'

const PeekHeaderContain = view({
  background: '#fff',
  position: 'relative',
  zIndex: 100,
})

const TitleBarTitle = props => (
  <UI.Text
    size={1.1}
    fontWeight={700}
    ellipse
    margin={0}
    padding={[4, 0]}
    lineHeight="1.5rem"
    textAlign="center"
    {...props}
  />
)

const TitleBarContain = view({
  flex: 1,
  maxWidth: '100%',
  padding: [0, 60],
})

TitleBarContain.theme = ({ theme }) => ({
  hover: {
    background: theme.hover.background.lighten(0.05),
  },
})

const SubTitle = ({ children, date, theme, permalink }) => (
  <UI.Row
    padding={[4, 12]}
    borderBottom={[1, theme.base.background.darken(0.1)]}
  >
    <UI.Text size={1} ellipse={1} alpha={0.8}>
      {children} <UI.Date>{date}</UI.Date>
    </UI.Text>
    <UI.Col if={permalink} flex={1} />
    <UI.Button
      if={permalink}
      size={0.9}
      icon="link"
      circular
      onClick={permalink}
    />
  </UI.Row>
)

const TitleBar = ({ children, after, ...props }) => (
  <TitleBarContain {...props}>
    <TitleBarTitle>{children}</TitleBarTitle>
    {after}
  </TitleBarContain>
)

@attachTheme
@view
export class PeekHeaderContent extends React.Component {
  render({
    peekStore,
    title,
    date,
    subtitle,
    permalink,
    icon,
    theme,
    ...props
  }) {
    return (
      <PeekHeaderContain ref={this.onHeader} theme={theme} {...props}>
        <TitleBar
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
          after={
            <UI.Row
              flexFlow="row"
              position="absolute"
              top={0}
              left={6}
              height={27}
              zIndex={10000}
              alignItems="center"
              transform={{
                scale: 0.9,
              }}
            >
              <WindowControls
                itemProps={{
                  style: {
                    marginLeft: 1,
                  },
                }}
                onClose={App.actions.clearPeek}
                onMax={() => {
                  App.setPeekState({ pinned: !App.peekState.pinned })
                }}
                maxProps={{
                  background: '#ccc',
                }}
              />
              <UI.Button
                if={peekStore.hasHistory}
                icon="arrowminleft"
                circular
                size={0.8}
                background="#f2f2f2"
              />
            </UI.Row>
          }
        >
          {title}
        </TitleBar>
        <SubTitle date={date} theme={theme} permalink={permalink}>
          {subtitle}
        </SubTitle>
      </PeekHeaderContain>
    )
  }
}

export const PeekHeader = view.attach('peekStore')(props => (
  <UI.Theme theme={props.peekStore.theme || false}>
    <PeekHeaderContent {...props} />
  </UI.Theme>
))

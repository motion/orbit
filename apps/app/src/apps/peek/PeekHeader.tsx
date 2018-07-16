import * as React from 'react'
import { view, attachTheme } from '@mcro/black'
import * as UI from '@mcro/ui'
import { OrbitIcon } from '../../apps/orbit/OrbitIcon'
import { WindowControls } from '../../views/WindowControls'
import { App } from '@mcro/stores'
import { NICE_INTEGRATION_NAMES } from '../../constants'
import { ControlButton } from '../../views/ControlButton'

const PeekHeaderContain = view(UI.View, {
  zIndex: 100,
})

PeekHeaderContain.theme = ({ theme, position }) => ({
  position: position || 'relative',
  borderBottom: [1, theme.base.borderColor],
  background: theme.base.background || '#fff',
})

const TitleBarTitle = props => (
  <UI.Text
    size={1.1}
    fontWeight={700}
    ellipse={1}
    margin={0}
    padding={[4, 60]}
    lineHeight="1.5rem"
    textAlign="center"
    {...props}
  />
)

const TitleBarContain = view({
  flex: 1,
  height: 30,
  maxWidth: '100%',
})

TitleBarContain.theme = ({ theme }) => ({
  '&:hover': {
    background: theme.hover.background.lighten(0.05),
  },
})

const SubTitle = ({ children }) => (
  <UI.Row padding={[4, 12]} alignItems="center" flex={1}>
    {children}
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
  render() {
    const {
      peekStore,
      title,
      date,
      subtitle,
      permalink,
      icon,
      theme,
      subhead,
      integration,
      ...props
    } = this.props
    return (
      <PeekHeaderContain
        draggable={true}
        onDragStart={peekStore.onDragStart}
        onDrag={peekStore.onDrag}
        onDragEnd={peekStore.onDragEnd}
        theme={theme}
        {...props}
      >
        <TitleBar
          after={
            <>
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
              <UI.Row
                flexFlow="row"
                position="absolute"
                top={0}
                left={6}
                right={0}
                height={27}
                zIndex={10000}
                alignItems="center"
              >
                <WindowControls
                  itemProps={{
                    style: {
                      marginLeft: 1,
                    },
                  }}
                  onClose={App.actions.clearPeek}
                  onMax={() => App.actions.toggleDevModeStick()}
                />
                <UI.Button
                  if={peekStore.hasHistory}
                  icon="arrowminleft"
                  circular
                  size={0.8}
                />
                <UI.View flex={1} />
                <ControlButton
                  if={!peekStore.tornState}
                  icon="z"
                  onClick={peekStore.tearPeek}
                />
              </UI.Row>
            </>
          }
        >
          {integration ? `${NICE_INTEGRATION_NAMES[integration]}: ` : ''}{' '}
          {title}
        </TitleBar>
        <SubTitle date={date} permalink={permalink}>
          {subtitle}
        </SubTitle>
        {subhead}
      </PeekHeaderContain>
    )
  }
}

export const PeekHeader = view.attach('peekStore')(
  view(props => (
    <UI.Theme theme={props.peekStore.theme || false}>
      <PeekHeaderContent {...props} />
    </UI.Theme>
  )),
)

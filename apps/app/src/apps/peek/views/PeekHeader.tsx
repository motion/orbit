import * as React from 'react'
import { view, attachTheme } from '@mcro/black'
import * as UI from '@mcro/ui'
import { WindowControls } from '../../../views/WindowControls'
import { App } from '@mcro/stores'
import { PeekStore } from '../stores/PeekStore'
import { color } from '@mcro/gloss'
// import { ControlButton } from '../../views/ControlButton'
import * as Constants from '../../../constants'
import { PeekContents } from '../PeekPaneProps'

type Props = PeekContents & {
  peekStore?: PeekStore
  theme?: any
  integration?: string
}

// the full header:
const PeekHeaderContain = view(UI.View, {
  background: 'transparent',
  zIndex: 100,
  overflow: 'hidden',
  borderTopRadius: Constants.PEEK_BORDER_RADIUS,
})

PeekHeaderContain.theme = ({ theme, position }) => {
  return {
    position: position || 'relative',
    borderBottom: [1, theme.base.background.darken(0.3)],
    background: theme.headerBackground || theme.base.background,
  }
}

// just the top titlebar:
const TitleBar = ({ children, after, ...props }) => (
  <TitleBarContain {...props}>
    <TitleBarText>{children}</TitleBarText>
    {after}
  </TitleBarContain>
)

const TitleBarContain = view({
  flex: 1,
  height: 27,
  maxWidth: '100%',
  position: 'relative',
  zIndex: 1,
})

TitleBarContain.theme = ({ theme }) => {
  const hoverBackground =
    (theme.titlebarBackground && theme.titlebarBackground.lighten(0.1)) ||
    color('rgba(255,255,255,0.04)')
  return {
    background: theme.titlebarBackground,
    '&:hover': {
      background: hoverBackground,
    },
  }
}

const TitleBarText = props => (
  <UI.Text
    size={1.1}
    fontWeight={700}
    ellipse={1}
    margin={0}
    padding={[3, 80]}
    lineHeight="1.5rem"
    textAlign="center"
    {...props}
  />
)

const Centered = view({
  position: 'absolute',
  top: 0,
  left: 100,
  right: 100,
  bottom: 0,
  overflow: 'hidden',
  alignItems: 'center',
  justifyContent: 'center',
  textAlign: 'center',
})

const textify = thing => {
  if (typeof thing === 'string') {
    return <UI.Text>{thing}</UI.Text>
  }
  return thing
}

const SubTitle = ({ children, before, after }) => (
  <UI.Row
    position="relative"
    padding={[0, 12]}
    alignItems="center"
    flex={1}
    height={32}
    zIndex={1}
  >
    {textify(before)}
    <div style={{ flex: 1 }} />
    <Centered>
      {typeof children === 'string' ? <UI.Text>{children}</UI.Text> : children}
    </Centered>
    {textify(after)}
  </UI.Row>
)

@attachTheme
@view
export class PeekHeaderContent extends React.Component<Props> {
  render() {
    const {
      peekStore,
      title,
      date,
      subtitle,
      subtitleBefore,
      subtitleAfter,
      permalink,
      icon,
      theme,
      subhead,
      integration,
      ...props
    } = this.props
    const hasSubTitle = !!(subtitle || subtitleBefore || subtitleAfter)
    return (
      <PeekHeaderContain
        draggable
        onDragStart={peekStore.onDragStart}
        theme={theme}
        {...props}
      >
        {/* Nice gradient effect on header */}
        <UI.FullScreen
          background="linear-gradient(rgba(255,255,255,0.025), transparent 44%)"
          pointerEvents="none"
        />
        {/* Fade below the icon */}
        <UI.View
          zIndex={1}
          pointerEvents="none"
          position="absolute"
          top={0}
          right={0}
          bottom={0}
          width={70}
          background={`linear-gradient(
            to right,
            transparent,
            ${
              theme.darkenTitleBarAmount
                ? theme.base.background.darken(theme.darkenTitleBarAmount)
                : 'transparent'
            }
          )`}
        />
        {/* <UI.HoverGlow
          width={400}
          height={300}
          opacity={0.1}
          blur={90}
          zIndex={10000}
          resist={50}
        /> */}
        <TitleBar
          after={
            <>
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
                <WindowControls onClose={App.actions.clearPeek} />
                {/* {!!peekStore.hasHistory && (
                  <UI.Button icon="arrowminleft" circular size={0.8} />
                )} */}
                <UI.View flex={1} />
                {/* {!!peekStore.tornState && (
                  <ControlButton icon="z" onClick={peekStore.tearPeek} />
                )} */}
              </UI.Row>
            </>
          }
        >
          {title}
        </TitleBar>
        {hasSubTitle && (
          <SubTitle before={subtitleBefore} after={subtitleAfter}>
            {subtitle}
          </SubTitle>
        )}
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

import * as React from 'react'
import { view, attachTheme } from '@mcro/black'
import * as UI from '@mcro/ui'
import { WindowControls } from '../../../views/WindowControls'
import { App } from '@mcro/stores'
import { PeekStore } from '../stores/PeekStore'
import * as Constants from '../../../constants'
import { PeekContents } from '../PeekPaneProps'
import { TitleBar } from './TitleBar'
import { CSSPropertySet } from '@mcro/gloss'

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

PeekHeaderContain.theme = ({ position, theme, focused }) => {
  let style: CSSPropertySet = {
    position: position || 'relative',
  }
  if (!focused) {
    style = {
      ...style,
      background: theme.titleBar.backgroundBlur,
    }
  } else {
    style = {
      ...style,
      background: theme.titleBar.background,
    }
  }
  return style
}

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
    padding={[0, 6]}
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

const MainHead = view({
  position: 'relative',
  flex: 1,
})

@attachTheme
@view
export class PeekHeaderContent extends React.Component<Props> {
  render() {
    const {
      peekStore,
      title,
      titleAfter,
      date,
      subtitle,
      subtitleBefore,
      subtitleAfter,
      permalink,
      icon,
      theme,
      belowHeadMain,
      belowHead,
      integration,
      ...props
    } = this.props
    const hasSubTitle = !!(subtitle || subtitleBefore || subtitleAfter)
    return (
      <PeekHeaderContain
        draggable
        focused
        onDragStart={peekStore.onDragStart}
        theme={theme}
        {...props}
      >
        <MainHead>
          {/* Nice gradient effect on header */}
          <UI.FullScreen
            background="linear-gradient(rgba(255,255,255,0.027), transparent 44%)"
            pointerEvents="none"
          />
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
                  {titleAfter}
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
          {belowHeadMain}
        </MainHead>
        {belowHead}
      </PeekHeaderContain>
    )
  }
}

export const PeekHeader = view.attach('peekStore')(
  view(props => <PeekHeaderContent {...props} />),
)

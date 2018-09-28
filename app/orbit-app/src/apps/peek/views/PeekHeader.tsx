import * as React from 'react'
import { view } from '@mcro/black'
import { attachTheme } from '@mcro/gloss'
import * as UI from '@mcro/ui'
import { WindowControls } from '../../../views/WindowControls'
import { PeekStore } from '../stores/PeekStore'
import * as Constants from '../../../constants'
import { PeekContents } from '../PeekPaneProps'
import { TitleBar } from './TitleBar'
import { CSSPropertySet } from '@mcro/gloss'
import { Glint } from '@mcro/ui'

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
}).theme(({ invisible, position, theme, focused }) => {
  if (invisible) {
    return null
  }
  let style: CSSPropertySet = {
    position: position || 'relative',
    // to keep things aligned
    paddingTop: 1,
  }
  if (!focused) {
    style = {
      ...style,
      background: theme.backgroundBlur,
      borderBottom: [1, theme.borderColorBlur],
    }
  } else {
    style = {
      ...style,
      background: theme.backgroundGradient || theme.background,
      borderBottom: [1, theme.borderBottomColor || theme.borderColor],
    }
  }
  return style
})

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
  <UI.Row position="relative" padding={[0, 6]} alignItems="center" flex={1} zIndex={1}>
    {textify(before)}
    <div style={{ flex: 1 }} />
    <Centered>{typeof children === 'string' ? <UI.Text>{children}</UI.Text> : children}</Centered>
    {textify(after)}
  </UI.Row>
)

const MainHead = view({
  flexFlow: 'row',
  position: 'relative',
  flex: 1,
  height: 35,
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
    const itemConfig = peekStore.state.appConfig.config
    const hideTitleBar = itemConfig && itemConfig.showTitleBar === false
    return (
      <PeekHeaderContain
        invisible={hideTitleBar}
        draggable
        focused
        onDragStart={peekStore.onDragStart}
        theme={theme}
        {...props}
      >
        <Glint borderRadius={7.5} opacity={0.65} top={0.5} />
        <MainHead>
          <TitleBar
            height="100%"
            before={
              <>
                <UI.Row
                  flexFlow="row"
                  padding={hideTitleBar ? 0 : [0, 0, 0, 8]}
                  height="100%"
                  alignItems="center"
                >
                  <WindowControls
                    onClose={peekStore.handleClose}
                    onMax={peekStore.isTorn ? peekStore.handleMaximize : null}
                    onMin={peekStore.isTorn ? peekStore.handleMinimize : null}
                  />
                  {titleAfter}
                </UI.Row>
              </>
            }
          >
            {hideTitleBar ? '' : title}
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
  view(props => (
    <UI.Theme select={theme => theme.titleBar || theme}>
      <PeekHeaderContent {...props} />
    </UI.Theme>
  )),
)

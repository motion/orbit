import * as React from 'react'
import { view } from '@mcro/black'
import { attachTheme } from '@mcro/gloss'
import * as UI from '@mcro/ui'
import { WindowControls } from '../../../views/WindowControls'
import { PeekStore } from '../stores/PeekStore'
import * as Constants from '../../../constants'
import { CSSPropertySet } from '@mcro/gloss'
import { Glint, Row, Text, View } from '@mcro/ui'

type Props = {
  peekStore?: PeekStore
  theme?: any
  integration?: string
  before?: React.ReactNode
  after?: React.ReactNode
  children?: React.ReactNode
}

// the full header:
const PeekHeaderContain = view(UI.View, {
  background: 'transparent',
  zIndex: 100,
  overflow: 'hidden',
  borderTopRadius: Constants.PEEK_BORDER_RADIUS,
  padding: [0, 8],
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

const MainHead = view({
  flexFlow: 'row',
  alignItems: 'center',
  position: 'relative',
  flex: 1,
  height: 33,
})

const HeaderSection = view(Row, {
  alignItems: 'center',
  height: '100%',
  position: 'relative',
})

const TitleBarText = props => (
  <div style={{ position: 'absolute', top: 0, left: 10, right: 10, bottom: 0 }}>
    <Text size={0.95} fontWeight={400} ellipse={1} margin={0} lineHeight="1.5rem" {...props} />
  </div>
)

@attachTheme
@view
export class PeekHeaderContent extends React.Component<Props> {
  render() {
    const { peekStore, theme, before, after, children, ...props } = this.props
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
          <WindowControls
            onClose={peekStore.handleClose}
            onMax={peekStore.isTorn ? peekStore.handleMaximize : null}
            onMin={peekStore.isTorn ? peekStore.handleMinimize : null}
          />
          {!!before && (
            <HeaderSection flex={1}>
              {typeof before === 'string' ? <TitleBarText>{before}</TitleBarText> : before}
            </HeaderSection>
          )}
          {!!children && <Centered>{children}</Centered>}
          {!!after && <HeaderSection>{after}</HeaderSection>}
        </MainHead>
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

import * as React from 'react'
import { view } from '@mcro/black'
import { attachTheme } from '@mcro/gloss'
import * as UI from '@mcro/ui'
import { WindowControls } from '../../../views/WindowControls'
import { PeekStore } from '../stores/PeekStore'
import * as Constants from '../../../constants'
import { TitleBar } from './TitleBar'
import { CSSPropertySet } from '@mcro/gloss'
import { Glint, View, Row } from '@mcro/ui'

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
  position: 'relative',
  flex: 1,
  height: 35,
})

const HeaderSection = view(Row, {
  alignItems: 'center',
  padding: 8,
})

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
                  <HeaderSection>{before}</HeaderSection>
                </UI.Row>
              </>
            }
          />
          <Centered>{children}</Centered>
          <View flex={1} />
          <HeaderSection>{after}</HeaderSection>
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

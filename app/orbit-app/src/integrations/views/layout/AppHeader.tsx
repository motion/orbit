import * as React from 'react'
import { view } from '@mcro/black'
import * as UI from '@mcro/ui'
import * as Constants from '../../../constants'
import { CSSPropertySet } from '@mcro/gloss'
import { Glint, Row, Text } from '@mcro/ui'
import { Centered } from '../../../views/Centered'
import { AppStore } from '../../../pages/AppPage/AppStore'

type Props = {
  appStore?: AppStore
  theme?: any
  integration?: string
  before?: React.ReactNode
  after?: React.ReactNode
  children?: React.ReactNode
}

// the full header:
const AppHeaderContain = view(UI.View, {
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

@view.attach('appStore')
@view
export class AppHeaderContent extends React.Component<Props> {
  render() {
    const { appStore, before, after, children, ...props } = this.props
    const { viewConfig } = appStore.state.appConfig
    const hideTitleBar = viewConfig && viewConfig.showTitleBar === false
    return (
      <AppHeaderContain
        invisible={hideTitleBar}
        draggable
        focused
        onDragStart={appStore.onDragStart}
        {...props}
      >
        <Glint borderRadius={7.5} opacity={0.65} top={0.5} />
        <MainHead>
          {!!before && (
            <HeaderSection flex={1}>
              {typeof before === 'string' ? <TitleBarText>{before}</TitleBarText> : before}
            </HeaderSection>
          )}
          {!!children && <Centered>{children}</Centered>}
          {!!after && <HeaderSection>{after}</HeaderSection>}
        </MainHead>
      </AppHeaderContain>
    )
  }
}

export const AppHeader = props => (
  <UI.Theme select={theme => theme.titleBar || theme}>
    <AppHeaderContent {...props} />
  </UI.Theme>
)

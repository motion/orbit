import * as React from 'react'
import * as UI from '@mcro/ui'
import * as Constants from '../../../constants'
import { CSSPropertySet, gloss } from '@mcro/gloss'
import { Glint, Row, Text } from '@mcro/ui'
import { HorizontalCenter } from '../../../views/HorizontalCenter'
import { AppPageStore } from '../../../pages/AppPage/AppPageStore'
import { useStoresSafe } from '../../../hooks/useStoresSafe'
import { observer } from 'mobx-react-lite'

type Props = {
  appPageStore?: AppPageStore
  theme?: any
  integration?: string
  before?: React.ReactNode
  after?: React.ReactNode
  children?: React.ReactNode
}

const AppHeaderContent = observer(function AppHeaderContent(props: Props) {
  const { appPageStore } = useStoresSafe()
  const { before, after, children, ...rest } = props
  let hideTitleBar = false
  if (appPageStore) {
    const { viewConfig } = appPageStore.state.appConfig
    hideTitleBar = !!viewConfig && viewConfig.showTitleBar === false
  }
  return (
    <AppHeaderContain
      invisible={hideTitleBar}
      draggable
      focused
      // onDragStart={appPageStore ? appPageStore.onDragStart : null}
      {...rest}
    >
      <Glint borderRadius={7.5} opacity={0.65} top={0.5} />
      <MainHead>
        {!!before && (
          <HeaderSection flex={1}>
            {typeof before === 'string' ? <TitleBarText>{before}</TitleBarText> : before}
          </HeaderSection>
        )}
        {!!children && <HorizontalCenter>{children}</HorizontalCenter>}
        {!!after && <HeaderSection>{after}</HeaderSection>}
      </MainHead>
    </AppHeaderContain>
  )
})

export const AppHeader = (props: Props) => (
  <UI.Theme select={theme => theme.titleBar || theme}>
    <AppHeaderContent {...props} />
  </UI.Theme>
)

// the full header:
const AppHeaderContain = gloss(UI.View, {
  background: 'transparent',
  zIndex: 100,
  overflow: 'hidden',
  borderTopRadius: Constants.PEEK_BORDER_RADIUS,
  padding: [0, 8],
}).theme(({ invisible, position, focused }, theme) => {
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

const MainHead = gloss({
  flexFlow: 'row',
  alignItems: 'center',
  position: 'relative',
  flex: 1,
  height: 33,
})

const HeaderSection = gloss(Row, {
  alignItems: 'center',
  height: '100%',
  position: 'relative',
})

const TitleBarText = props => (
  <div style={{ position: 'absolute', top: 0, left: 10, right: 10, bottom: 0 }}>
    <Text size={0.95} fontWeight={400} ellipse={1} margin={0} lineHeight="1.5rem" {...props} />
  </div>
)

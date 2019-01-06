import { StoreContext } from '@mcro/black'
import { Text, View, Tooltip } from '@mcro/ui'
import * as React from 'react'
import { AppPanes } from '../../stores/SpaceStore'
import { Icon } from '../../views/Icon'
import * as UI from '@mcro/ui'
import { observer } from 'mobx-react-lite'
import { gloss } from '@mcro/gloss'

export const SpaceNavHeight = () => <div style={{ height: 42, pointerEvents: 'none' }} />

export const OrbitNav = observer(() => {
  const { paneManagerStore } = React.useContext(StoreContext)
  return (
    <OrbitNavClip>
      <OrbitNavChrome>
        {AppPanes.map((pane, index) => {
          const isLast = index !== AppPanes.length - 1
          const isActive = paneManagerStore.activePane === pane.id
          const nextIsActive =
            AppPanes[index + 1] && paneManagerStore.activePane === AppPanes[index + 1].id
          return (
            <NavButton
              key={pane.id}
              isActive={isActive}
              label={pane.title}
              stretch
              separator={!isActive && isLast && !nextIsActive}
              onClick={paneManagerStore.activePaneSetter(pane.id)}
            >
              <Icon name={`${pane.icon}`} size={16} />
            </NavButton>
          )
        })}
        <NavButton tooltip="Create app">
          <UI.Icon name="simpleadd" size={12} opacity={0.35} />
        </NavButton>
        <View flex={1} minWidth={10} />
        <NavButton
          isActive={paneManagerStore.activePane === 'sources'}
          onClick={paneManagerStore.activePaneSetter('sources')}
          label="Orbit"
          textProps={{ alpha: 0.5 }}
        />
      </OrbitNavChrome>
    </OrbitNavClip>
  )
})

const OrbitNavClip = gloss({
  overflow: 'hidden',
  paddingTop: 20,
  marginTop: -20,
})

const OrbitNavChrome = gloss({
  flexFlow: 'row',
  position: 'relative',
  zIndex: 1000,
  alignItems: 'flex-end',
  // background: '#00000099',
})

const buttonSidePad = 12

const NavButtonChrome = gloss<{ isActive?: boolean; stretch?: boolean }>({
  position: 'relative',
  flexFlow: 'row',
  alignItems: 'center',
  justifyContent: 'center',
  padding: [5, buttonSidePad],
  height: 30,
  maxWidth: 180,
}).theme(({ isActive, stretch }, theme) => {
  const background = isActive
    ? theme.tabBackgroundActive || theme.background
    : theme.tabBackground || theme.background
  return {
    flex: stretch ? 1 : 'none',
    minWidth: stretch ? 90 : 0,
    background: isActive ? background : 'transparent',
    // textShadow: isActive ? 'none' : `0 -1px 0 #ffffff55`,
    // border: [1, isActive ? theme.borderColor : 'transparent'],
    // borderBottom: 'none',
    boxShadow: isActive ? [[0, 0, 20, [0, 0, 0, 0.05]]] : null,
    // borderTopRadius: 3,
    '&:hover': {
      background: isActive ? background : [0, 0, 0, 0.05],
      transition: isActive ? 'none' : 'all ease-out 500ms',
    },
  }
})

const NavButton = ({
  children = null,
  tooltip = null,
  label = null,
  isActive = false,
  separator = false,
  textProps = null,
  ...props
}) => (
  <Tooltip label={tooltip}>
    <NavButtonChrome isActive={isActive} {...props}>
      {children}
      {!!label && (
        <Text
          size={0.95}
          marginLeft={!!children ? buttonSidePad * 0.75 : 0}
          fontWeight={500}
          {...textProps}
        >
          {label}
        </Text>
      )}
      {separator && <Separator />}
    </NavButtonChrome>
  </Tooltip>
)

const Separator = gloss({
  position: 'absolute',
  top: 0,
  right: 0,
  bottom: 0,
  width: 1,
  background: 'linear-gradient(transparent, #ddd)',
})

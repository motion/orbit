import { Text, View, Tooltip, Row, Popover } from '@mcro/ui'
import * as React from 'react'
import { Icon } from '../../views/Icon'
import { observer } from 'mobx-react-lite'
import { gloss } from '@mcro/gloss'
import { useActiveApps } from '../../hooks/useActiveApps'
import { useStoresSafe } from '../../hooks/useStoresSafe'
import { App } from '@mcro/models'
import { SortableContainer, SortableElement, arrayMove } from 'react-sortable-hoc'
import { useActiveSpace } from '../../hooks/useActiveSpace'

const height = 26
const inactiveOpacity = 0.8

type TabProps = React.HTMLAttributes<'div'> & {
  app?: App
  separator?: boolean
  isActive?: boolean
  label?: string
  stretch?: boolean
  sidePad?: number
  tooltip?: string
  textProps?: any
  showDropdown?: boolean
}

const SortableTab = SortableElement((props: TabProps) => {
  return <Tab {...props} />
})

const SortableTabs = SortableContainer((props: { items: TabProps[] }) => {
  return (
    <Row flex={10}>
      {props.items.map((item, index) => (
        <SortableTab {...item} key={index} index={index} />
      ))}
    </Row>
  )
})

export default observer(function OrbitNav() {
  const { paneManagerStore } = useStoresSafe()
  const activeApps = useActiveApps()
  const appIds = activeApps.map(x => x.id)
  const [space, updateSpace] = useActiveSpace()

  // keep apps in sync with paneSort
  // TODO: this can be refactored into useSyncSpacePaneOrderEffect
  //       but we should refactor useObserve/useModel first so it re-uses
  //       identical queries using a WeakMap so we dont have tons of observes...
  React.useEffect(
    () => {
      if (!space || !activeApps.length) {
        return
      }
      if (!space.paneSort) {
        updateSpace({ paneSort: activeApps.map(x => x.id) })
        return
      }
      if (activeApps.length && activeApps.length !== space.paneSort.length) {
        updateSpace({ paneSort: activeApps.map(x => x.id) })
        return
      }
    },
    [space && space.id, appIds.join('')],
  )

  if (!activeApps.length || !space || !space.paneSort) {
    return (
      <OrbitNavClip>
        <OrbitNavChrome />
      </OrbitNavClip>
    )
  }

  const items: TabProps[] = space.paneSort.map((id, index) => {
    const app = activeApps.find(x => x.id === id)
    const isLast = index !== activeApps.length
    const isActive = paneManagerStore.activePane.id === app.id
    const nextIsActive =
      activeApps[index + 1] && paneManagerStore.activePane.id === activeApps[index + 1].id
    const isPinned = app.type === 'search'
    return {
      app,
      separator: !isActive && isLast && !nextIsActive,
      isActive,
      disabled: isPinned,
      label: isPinned ? '' : app.name,
      stretch: !isPinned,
      showDropdown: !isPinned,
      sidePad: isPinned ? 20 : buttonSidePad,
      onClick: paneManagerStore.activePaneSetter(app.id),
      children: (
        <Icon
          name={`${app.type}`}
          size={isPinned ? 14 : 12}
          opacity={isActive ? 1 : inactiveOpacity - 0.15}
        />
      ),
    }
  })

  return (
    <>
      <OrbitNavClip>
        <OrbitNavChrome>
          <SortableTabs
            axis="x"
            lockAxis="x"
            distance={15}
            items={items}
            onSortEnd={({ oldIndex, newIndex }) => {
              updateSpace({ paneSort: arrayMove(space.paneSort, oldIndex, newIndex) })
            }}
          />
          <View flex={1} minWidth={10} />
          <Tab tooltip="Add app">
            <Icon name="simpleadd" size={12} opacity={0.5} />
          </Tab>
          <Tab
            isActive={paneManagerStore.activePane.name === 'Sources'}
            onClick={paneManagerStore.activePaneByNameSetter('Sources')}
            tooltip="Sources"
          >
            <Icon name="design_app" size={12} opacity={0.5} />
          </Tab>
        </OrbitNavChrome>
      </OrbitNavClip>
      {items
        .filter(x => x.showDropdown)
        .map(item => (
          <Popover
            key={item.app.id}
            openOnClick
            closeOnClick
            closeOnClickAway
            theme="light"
            width={300}
            background
            borderRadius={8}
            elevation={7}
            target={`.appDropdown-${item.app.id}`}
          >
            test me out
          </Popover>
        ))}
    </>
  )
})

const Tab = ({
  app,
  children,
  tooltip,
  label,
  isActive = false,
  separator = false,
  showDropdown = false,
  sidePad = buttonSidePad,
  textProps,
  className = '',
  ...props
}: TabProps) => {
  const [hovered, setHovered] = React.useState(false)
  const button = (
    <NavButtonChrome
      className={`undraggable ${className}`}
      isActive={isActive}
      sidePad={sidePad}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      {...props}
    >
      {children}
      {!!label && (
        <Text
          size={0.95}
          marginLeft={!!children ? buttonSidePad * 0.75 : 0}
          alpha={isActive ? 1 : inactiveOpacity}
          fontWeight={500}
          {...textProps}
        >
          {label}
        </Text>
      )}
      {separator && <Separator />}

      {showDropdown && (
        <DropdownArrow
          className={`appDropdown ${app ? `appDropdown-${app.id}` : ''}`}
          style={{ opacity: hovered ? 0.2 : 0, right: sidePad }}
        />
      )}
    </NavButtonChrome>
  )
  if (tooltip) {
    return <Tooltip label={tooltip}>{button}</Tooltip>
  }
  return button
}

function DropdownArrow({ style, ...props }) {
  return (
    <Icon
      name="downArrow"
      size={8}
      style={{
        transition: 'all ease 200ms 200ms',
        position: 'absolute',
        top: height / 2 - 8 / 2,
        ...style,
      }}
      {...props}
    />
  )
}

const OrbitNavClip = gloss({
  overflow: 'hidden',
  padding: [20, 10, 0],
  margin: [-20, 0, 0],
})

const OrbitNavChrome = gloss({
  height,
  flexFlow: 'row',
  position: 'relative',
  zIndex: 1000,
  alignItems: 'flex-end',
  // background: '#00000099',
})

const buttonSidePad = 14

const NavButtonChrome = gloss<{ isActive?: boolean; stretch?: boolean; sidePad: number }>({
  position: 'relative',
  flexFlow: 'row',
  alignItems: 'center',
  justifyContent: 'center',
  height,
  maxWidth: 180,
  borderTopRadius: 3,
}).theme(({ isActive, stretch, sidePad }, theme) => {
  // const background = theme.tabBackground || theme.background
  const background = theme.tabBackground || theme.background
  const glowStyle = {
    background: isActive ? background : theme.tabInactiveHover || [0, 0, 0, 0.05],
    transition: isActive ? 'none' : 'all ease-out 500ms',
  }
  return {
    padding: [5, sidePad],
    flexGrow: stretch ? 1 : 0,
    minWidth: stretch ? 90 : 0,
    background: isActive ? background : 'transparent',
    // textShadow: isActive ? 'none' : `0 -1px 0 #ffffff55`,
    // border: [1, isActive ? theme.borderColor : 'transparent'],
    // borderBottom: 'none',
    boxShadow: isActive ? [[0, 3, 8, [0, 0, 0, 0.05]]] : null,
    // borderTopRadius: 3,
    '&:hover': glowStyle,
    '&:active': glowStyle,
  }
})

const Separator = gloss({
  position: 'absolute',
  top: 0,
  right: 0,
  bottom: 0,
  width: 1,
  background: 'linear-gradient(transparent, rgba(0,0,0,0.08))',
})

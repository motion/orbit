import { Text, View, Tooltip, Row } from '@mcro/ui'
import * as React from 'react'
import { Icon } from '../../views/Icon'
import { observer } from 'mobx-react-lite'
import { gloss } from '@mcro/gloss'
import { useObserveActiveApps } from '../../hooks/useObserveActiveApps'
import { useStoresSafe } from '../../hooks/useStoresSafe'
import { App } from '@mcro/models'
import { SortableContainer, SortableElement, arrayMove } from 'react-sortable-hoc'

export const SpaceNavHeight = () => <div style={{ height: 42, pointerEvents: 'none' }} />

type SortableTabProps = {
  app: App
  separator: boolean
  isActive: boolean
  label?: string
  stretch?: boolean
  onClick?: Function
  children?: React.ReactNode
}

const SortableTab = SortableElement((props: SortableTabProps) => {
  return (
    <NavButton
      isActive={props.isActive}
      label={props.label}
      stretch={props.stretch}
      separator={props.separator}
      onClick={props.onClick}
    >
      {props.children}
    </NavButton>
  )
})

const SortableTabs = SortableContainer((props: { items: SortableTabProps[] }) => {
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
  const activeApps = useObserveActiveApps()
  const appIds = activeApps.map(x => x.id)
  const [sort, setSort] = React.useState([])

  // default sort
  React.useEffect(() => setSort(appIds), [appIds.join('')])

  if (!activeApps.length) {
    return null
  }

  const appItems = sort.map((id, index) => {
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
      label: isPinned ? '' : app.name,
      stretch: !isPinned,
      onClick: paneManagerStore.activePaneSetter(app.id),
      children: <Icon name={`${app.type}`} size={14} opacity={isActive ? 1 : 0.8} />,
    }
  })

  const items = [
    ...appItems,
    {
      children: <Icon name="simpleadd" size={12} opacity={0.35} />,
    },
  ]

  return (
    <>
      <OrbitNavClip>
        <OrbitNavChrome>
          <SortableTabs
            axis="x"
            lockAxis="x"
            items={items}
            onSortEnd={({ oldIndex, newIndex }) => {
              setSort(arrayMove(sort, oldIndex, newIndex))
            }}
          />
          <View flex={1} minWidth={10} />
          <NavButton
            isActive={paneManagerStore.activePane.name === 'Sources'}
            onClick={paneManagerStore.activePaneByNameSetter('Sources')}
            label="Sources"
          />
        </OrbitNavChrome>
      </OrbitNavClip>
    </>
  )
})

const OrbitNavClip = gloss({
  overflow: 'hidden',
  padding: [20, 10, 0],
  margin: [-20, 0, 0],
})

const OrbitNavChrome = gloss({
  flexFlow: 'row',
  position: 'relative',
  zIndex: 1000,
  alignItems: 'flex-end',
  // background: '#00000099',
})

const buttonSidePad = 14

const NavButtonChrome = gloss<{ isActive?: boolean; stretch?: boolean }>({
  position: 'relative',
  flexFlow: 'row',
  alignItems: 'center',
  justifyContent: 'center',
  height: 26,
  maxWidth: 180,
  borderTopRadius: 3,
}).theme(({ isActive, stretch }, theme) => {
  const background = isActive
    ? theme.tabBackgroundActive || theme.background
    : theme.tabBackground || theme.background
  return {
    padding: [5, stretch ? buttonSidePad : buttonSidePad * 1.33],
    flex: stretch ? 1 : 'none',
    minWidth: stretch ? 90 : 0,
    background: isActive ? background : 'transparent',
    // textShadow: isActive ? 'none' : `0 -1px 0 #ffffff55`,
    // border: [1, isActive ? theme.borderColor : 'transparent'],
    // borderBottom: 'none',
    boxShadow: isActive ? [[0, 0, 15, [0, 0, 0, 0.025]]] : null,
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
  className = '',
  ...props
}) => {
  const button = (
    <NavButtonChrome className={`undraggable ${className}`} isActive={isActive} {...props}>
      {children}
      {!!label && (
        <Text
          size={0.95}
          marginLeft={!!children ? buttonSidePad * 0.75 : 0}
          alpha={isActive ? 1 : 0.85}
          fontWeight={500}
          {...textProps}
        >
          {label}
        </Text>
      )}
      {separator && <Separator />}
    </NavButtonChrome>
  )
  if (tooltip) {
    return <Tooltip label={tooltip}>{button}</Tooltip>
  }
  return button
}

const Separator = gloss({
  position: 'absolute',
  top: 0,
  right: 0,
  bottom: 0,
  width: 1,
  background: 'linear-gradient(transparent, rgba(0,0,0,0.08))',
})

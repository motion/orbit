import { invertLightness } from '@mcro/color'
import { gloss, Row, ThemeContext } from '@mcro/gloss'
import { App } from '@mcro/models'
import { Button, IconProps, Text, Tooltip, View } from '@mcro/ui'
import { capitalize } from 'lodash'
import { observer } from 'mobx-react-lite'
import * as React from 'react'
import { arrayMove, SortableContainer, SortableElement } from 'react-sortable-hoc'
import { useActiveApps } from '../../hooks/useActiveApps'
import { useActiveSpace } from '../../hooks/useActiveSpace'
import { useStoresSafe } from '../../hooks/useStoresSafe'
import { useUserSpaceConfig } from '../../hooks/useUserSpaceConfig'
import { Icon } from '../../views/Icon'

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
  onClickPopout?: Function
  thicc?: boolean
  icon?: string
  iconSize?: number
}

const SortableTab = SortableElement((props: TabProps) => {
  return <OrbitTab {...props} />
})

const SortableTabs = SortableContainer((props: { items: TabProps[] }) => {
  return (
    <Row>
      {props.items.map((item, index) => (
        <SortableTab {...item} key={index} index={index} />
      ))}
    </Row>
  )
})

export default observer(function OrbitNav() {
  const { orbitStore, paneManagerStore, newAppStore } = useStoresSafe()
  const activeApps = useActiveApps()
  const appIds = activeApps.map(x => x.id)
  const [space, updateSpace] = useActiveSpace()
  const [spaceConfig, updateSpaceConfig] = useUserSpaceConfig()
  const [showCreateNew, setShowCreateNew] = React.useState(false)

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

  if (orbitStore.isTorn) {
    return null
  }

  // after hooks

  if (!activeApps.length || !space || !space.paneSort) {
    return (
      <OrbitNavClip>
        <OrbitNavChrome />
      </OrbitNavClip>
    )
  }

  const items = space.paneSort.map(
    (id, index): TabProps => {
      const app = activeApps.find(x => x.id === id)
      const isLast = index !== activeApps.length
      const isActive = !showCreateNew && paneManagerStore.activePane.id === app.id
      const nextIsActive =
        activeApps[index + 1] && paneManagerStore.activePane.id === activeApps[index + 1].id
      const isPinned = app.type === 'search'
      return {
        app,
        separator: !isActive && isLast && !nextIsActive,
        label: isPinned ? '' : app.name,
        stretch: !isPinned,
        thicc: isPinned,
        isActive,
        icon: `orbit${capitalize(app.type)}`,
        iconSize: isPinned ? 16 : 12,
        onClick: () => {
          setShowCreateNew(false)
          paneManagerStore.setActivePane(app.id)
        },
        onClickPopout:
          !isPinned &&
          (() => {
            orbitStore.setTorn()
          }),
      }
    },
  )

  return (
    <OrbitNavClip>
      {/* <Popover open width={200} elevation={1} target=".appDropdown-10">
        <ListItem
          slim
          title="Open"
          subtitle="Persist this window"
          after={<Icon size={12} opacity={0.5} name="keyboardArrowReturn" />}
        />
        <ListItem slim title="Settings" />
        <ListItem slim title="Remove" />
      </Popover> */}

      <OrbitNavChrome>
        <SortableTabs
          axis="x"
          lockAxis="x"
          distance={8}
          items={items}
          onSortEnd={({ oldIndex, newIndex }) => {
            const paneSort = arrayMove([...space.paneSort], oldIndex, newIndex)
            const { activePaneIndex } = spaceConfig
            // if they dragged active tab we need to sync the new activeIndex to PaneManager through here
            const activePaneId = space.paneSort[activePaneIndex]
            console.log('sort finish', paneSort, space.paneSort, activePaneIndex, activePaneId)
            if (activePaneId !== paneSort[activePaneIndex]) {
              console.log('updating active index to', paneSort.indexOf(activePaneId))
              updateSpaceConfig({
                activePaneIndex: paneSort.indexOf(activePaneId),
              })
            }
            updateSpace({ paneSort })
          }}
        />
        {showCreateNew && (
          <OrbitTab
            stretch
            icon={`orbit${capitalize(newAppStore.type)}`}
            iconSize={12}
            isActive
            label={newAppStore.name || 'New app'}
          />
        )}
        <OrbitTab
          tooltip={showCreateNew ? 'Cancel' : 'Add'}
          thicc
          icon={showCreateNew ? 'remove' : 'add'}
          onClick={() => {
            if (!showCreateNew) {
              paneManagerStore.setActivePaneByType('createApp')
            } else {
              paneManagerStore.back()
            }
            setShowCreateNew(!showCreateNew)
          }}
        />
        <View flex={2} />
        <OrbitTab
          thicc
          isActive={paneManagerStore.activePane.type === 'apps'}
          onClick={paneManagerStore.activePaneByTypeSetter('apps')}
          tooltip="All Apps"
          separator
          icon="grid48"
        />
        <OrbitTab
          thicc
          isActive={paneManagerStore.activePane.type === 'sources'}
          onClick={paneManagerStore.activePaneByTypeSetter('sources')}
          tooltip="Sources"
          icon="design_app"
          iconSize={11}
        />
      </OrbitNavChrome>
    </OrbitNavClip>
  )
})

const OrbitTab = ({
  app,
  icon,
  iconSize = 10,
  tooltip,
  label,
  isActive = false,
  separator = false,
  onClickPopout,
  textProps,
  thicc,
  className = '',
  ...props
}: TabProps) => {
  const sidePad = thicc ? 20 : 12
  const button = (
    <NavButtonChrome
      className={`undraggable ${className}`}
      isActive={isActive}
      sidePad={sidePad}
      {...props}
    >
      <Row maxWidth="100%" alignItems="center" justifyContent="center">
        {!!icon && (
          <OrbitTabIcon
            opacity={isActive ? (!label ? 0.9 : 0.6) : !label ? 0.5 : 0.25}
            isActive={isActive}
            name={icon}
            size={iconSize}
          />
        )}
        {!!label && (
          <Text
            ellipse
            className="tab-label"
            size={0.9}
            marginLeft={!!icon ? sidePad * 0.7 : 0}
            opacity={isActive ? 1 : inactiveOpacity}
            fontWeight={500}
            {...textProps}
          >
            {label}
          </Text>
        )}
      </Row>
      {separator && <Separator />}

      {isActive && !!onClickPopout && (
        <DropDownButton
          className={`appDropdown ${app ? `appDropdown-${app.id}` : ''}`}
          right={sidePad * 0.25}
          tooltip="Open"
          onClick={e => {
            e.preventDefault()
            e.stopPropagation()
            onClickPopout()
          }}
        />
      )}
    </NavButtonChrome>
  )
  if (tooltip) {
    return <Tooltip label={tooltip}>{button}</Tooltip>
  }
  return button
}

function OrbitTabIcon({ opacity, ...props }: IconProps) {
  const { activeTheme } = React.useContext(ThemeContext)
  return (
    <View position="relative" opacity={opacity}>
      <Icon transform={{ y: height % 2 === 0 ? 0.5 : -0.5 }} {...props} />
      {/* show underneath an opposite colored one to */}
      <Icon
        transform={{ y: height % 2 === 0 ? 0.5 : -0.5 }}
        color={invertLightness(activeTheme.color, 0.2)}
        position="absolute"
        top={0}
        left={0}
        zIndex={-1}
        {...props}
      />
    </View>
  )
}

function DropDownButton(props) {
  return (
    <Button
      circular
      borderWidth={0}
      width={18}
      height={18}
      icon="downArrow"
      background="transparent"
      iconProps={{ size: 8 }}
      opacity={0}
      top={height / 2 - 9}
      position="absolute"
      hoverStyle={{
        opacity: 0.2,
      }}
      {...props}
    />
  )
}

const OrbitNavClip = gloss({
  overflow: 'hidden',
  padding: [20, 25, 0],
  margin: [-20, 0, 0],
}).theme((_, theme) => ({
  boxShadow: [['inset', 0, -0.5, 0, theme.borderColor.alpha(0.6)]],
}))

const OrbitNavChrome = gloss({
  height,
  flexFlow: 'row',
  position: 'relative',
  zIndex: 1000,
  alignItems: 'flex-end',
  // background: '#00000099',
})

const NavButtonChrome = gloss<{ isActive?: boolean; stretch?: boolean; sidePad: number }>({
  position: 'relative',
  flexFlow: 'row',
  alignItems: 'center',
  justifyContent: 'center',
  height,
  maxWidth: 180,
  borderTopRadius: 3,
  transform: {
    y: 0.5,
  },
}).theme(({ isActive, stretch, sidePad }, theme) => {
  // const background = theme.tabBackground || theme.background
  const background = theme.tabBackground || theme.background
  const glowStyle = {
    background: isActive ? background : theme.tabInactiveHover || [0, 0, 0, 0.05],
    transition: isActive ? 'none' : 'all ease-out 500ms',
  }
  return {
    padding: [0, sidePad],
    minWidth: stretch ? 160 : 0,
    background: isActive ? background : 'transparent',
    // textShadow: isActive ? 'none' : `0 -1px 0 #ffffff55`,
    // border: [1, isActive ? theme.borderColor : 'transparent'],
    // borderBottom: [1, theme.borderColor],
    boxShadow: isActive
      ? [[0, 2, 9, [0, 0, 0, 0.045]], ['inset', 0, 0, 0, 0.5, theme.borderColor]]
      : null,
    // borderTopRadius: 3,
    '&:hover': glowStyle,
    '&:hover .tab-label': {
      opacity: 1,
    },
    '&:active': glowStyle,
  }
})

const Separator = gloss({
  position: 'absolute',
  top: 0,
  right: 0,
  bottom: 0,
  transform: {
    y: -1,
  },
  width: 1,
  background: 'linear-gradient(transparent 15%, rgba(0,0,0,0.048))',
})

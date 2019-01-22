import { ensure, react } from '@mcro/black'
import { CSSPropertySet } from '@mcro/gloss'
import { App } from '@mcro/stores'
import { Col, Popover, View } from '@mcro/ui'
import { useStore } from '@mcro/use-store'
import { observer } from 'mobx-react-lite'
import * as React from 'react'
import { AppActions } from '../../actions/AppActions'
import { StoreContext } from '../../contexts'
import { fuzzyQueryFilter } from '../../helpers'
import { useStoresSafe } from '../../hooks/useStoresSafe'
import FocusableShortcutHandler from '../../views/FocusableShortcutHandler'
import { Icon } from '../../views/Icon'
import { NavButton } from '../../views/NavButton'
import { OrbitOrb } from '../../views/OrbitOrb'
import { RowItem } from '../../views/RowItem'

type Props = React.HTMLProps<HTMLDivElement> & CSSPropertySet

class SpaceSwitchStore {
  props: Props
  stores = React.useContext(StoreContext)
  popoverContentRef = React.createRef<HTMLDivElement>()
  selectedIndex = 0
  open = false
  query = ''
  spaceSwitcherRef = React.createRef<Popover>()

  setOpen = open => {
    this.open = open
    if (this.popoverContentRef.current) {
      this.popoverContentRef.current.focus()
    }
  }

  get filteredSpaces() {
    return fuzzyQueryFilter(this.query, this.stores.spaceStore.inactiveSpaces)
  }

  get spaces() {
    return this.stores.spaceStore.spaces
  }

  down = e => {
    e.stopPropagation()
    this.selectedIndex = Math.min(this.selectedIndex + 1, this.spaces.length - 1)
  }

  up = e => {
    e.stopPropagation()
    this.selectedIndex = Math.max(this.selectedIndex - 1, 0)
  }

  spaceOpener = react(
    () => App.state.showSpaceSwitcher,
    () => {
      const ref = this.spaceSwitcherRef.current
      ensure('ref', !!ref)
      if (ref) {
        ref.toggleOpen()
      }
    },
  )
}

const shortcuts = {
  select: 'enter',
  up: 'up',
  down: 'down',
}

const createNewSpace = () => {
  AppActions.togglePeekApp({
    appConfig: {
      type: 'newSpace',
      title: 'New Space',
      icon: 'orbit',
    },
    // TODO
    target: [0, 0],
  })
}

export default observer(function OrbitSpaceSwitch(props: Props) {
  const stores = useStoresSafe()
  const store = useStore(SpaceSwitchStore, props)

  const handlers = {
    select: () => {
      console.log('should switch space')
      // switch active space
    },
    down: store.down,
    up: store.up,
  }

  const goToTeamSettings = () => {
    stores.paneManagerStore.setActivePaneByType('settings')
  }

  const { activeSpace } = stores.spaceStore
  const { selectedIndex, filteredSpaces } = store
  const borderRadius = 8

  return (
    <FocusableShortcutHandler focused={store.open} shortcuts={shortcuts} handlers={handlers}>
      <Popover
        ref={store.spaceSwitcherRef}
        delay={100}
        openOnClick
        closeOnClickAway
        theme="light"
        width={300}
        background
        borderRadius={borderRadius}
        elevation={7}
        group="filters"
        onChangeVisibility={store.setOpen}
        target={
          <NavButton
            chromeless
            margin={['auto', 0]}
            transform={{
              y: -0.5,
            }}
            {...props}
          >
            <OrbitOrb size={16} background={'#DDADDA'} color="#985FC9" />
          </NavButton>
        }
      >
        <Col
          forwardRef={store.popoverContentRef}
          borderRadius={borderRadius}
          overflow="hidden"
          flex={1}
        >
          <View overflowY="auto" maxHeight={300}>
            {activeSpace ? (
              <RowItem
                orb={activeSpace.colors}
                title={activeSpace.name}
                subtitle="20 people"
                after={<Icon onClick={goToTeamSettings} name="gear" size={14} opacity={0.5} />}
                hover={false}
              />
            ) : (
              <div>No spaces</div>
            )}
            <View flex={1} margin={[2, 10]} background="#eee" height={1} />
            {filteredSpaces.map((space, index) => {
              return (
                <RowItem
                  onClick={() => (stores.spaceStore.activeIndex = index)}
                  key={space.id}
                  selected={selectedIndex === index + 1}
                  orb={space.color}
                  title={space.name}
                  titleProps={{ fontWeight: 400, size: 0.95, alpha: 0.8 }}
                  {...space.props}
                />
              )
            })}
            <RowItem
              onClick={createNewSpace}
              key="new-space"
              title="Create new space..."
              titleProps={{ fontWeight: 300, size: 0.9, alpha: 0.8 }}
              after={<Icon name="addcircle" size={14} fill="#444" />}
            />
          </View>
        </Col>
      </Popover>
    </FocusableShortcutHandler>
  )
})

import * as React from 'react'
import { view, ensure } from '@mcro/black'
import { Popover, View, Col } from '@mcro/ui'
import { reaction } from 'mobx'
import { App } from '@mcro/stores'
import { PaneManagerStore } from '../../PaneManagerStore'
import { NavButton } from '../../../../views/NavButton'
import { OrbitIcon } from '../../../../views/OrbitIcon'
import { OrbitOrb } from '../orbitSettings/OrbitOrb'
import { CSSPropertySet } from '@mcro/gloss'
import { RowItem } from '../../../../views/RowItem'
import { FocusableShortcutHandler } from '../../../../views/FocusableShortcutHandler'
import { SpaceStore } from '../../../../stores/SpaceStore'
import { Icon } from '../../../../views/Icon'

type Props = {
  paneManagerStore?: PaneManagerStore
  spaceStore?: SpaceStore
} & React.HTMLProps<HTMLDivElement> &
  CSSPropertySet

class SpaceSwitchStore {
  props: Props
  popoverContentRef = React.createRef<HTMLDivElement>()
  selectedIndex = 0
  open = false

  setOpen = open => {
    this.open = open
    if (this.popoverContentRef.current) {
      this.popoverContentRef.current.focus()
    }
  }

  get spaces() {
    return this.props.spaceStore.spaces
  }

  down = e => {
    e.stopPropagation()
    this.selectedIndex = Math.min(this.selectedIndex + 1, this.spaces.length - 1)
  }

  up = e => {
    e.stopPropagation()
    this.selectedIndex = Math.max(this.selectedIndex - 1, 0)
  }
}

@view.attach('spaceStore', 'paneManagerStore')
@view.attach({
  store: SpaceSwitchStore,
})
@view
export class OrbitSpaceSwitch extends React.Component<Props> {
  spaceSwitcherRef = React.createRef<Popover>()

  spaceOpener = reaction(
    () => App.state.showSpaceSwitcher,
    () => {
      ensure('this.spaceSwitcherRef.current', !!this.spaceSwitcherRef.current)
      this.spaceSwitcherRef.current.toggleOpen()
    },
  )

  componenWillUnmount() {
    this.spaceOpener()
  }

  render() {
    const { paneManagerStore, spaceStore, store, ...props } = this.props
    const { activeSpace, inactiveSpaces } = spaceStore
    const { selectedIndex } = store

    const shortcuts = {
      select: 'enter',
      up: 'up',
      down: 'down',
    }
    const handlers = {
      select: () => {
        console.log('should switch space')
        // switch active space
      },
      down: store.down,
      up: store.up,
    }

    if (store.open) {
      console.log('FOCUSING ON SHORTCUTS...')
    }

    const borderRadius = 8
    return (
      <FocusableShortcutHandler focused={store.open} shortcuts={shortcuts} handlers={handlers}>
        <Popover
          ref={this.spaceSwitcherRef}
          delay={100}
          openOnClick
          openOnHover
          // closeOnClick
          closeOnClickAway
          theme="light"
          width={300}
          background
          adjust={[116, 0]}
          borderRadius={borderRadius}
          elevation={7}
          group="filters"
          onChangeVisibility={store.setOpen}
          target={
            <NavButton chromeless {...props}>
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
              <RowItem
                orb={activeSpace.color}
                title={activeSpace.name}
                subtitle="20 people"
                after={
                  <OrbitIcon
                    onClick={paneManagerStore.goToTeamSettings}
                    name="gear"
                    size={14}
                    opacity={0.5}
                  />
                }
                hover={false}
              />
              <View flex={1} margin={[2, 10]} background="#eee" height={1} />
              {inactiveSpaces.map((space, index) => {
                return (
                  <RowItem
                    key={space.name}
                    selected={selectedIndex === index + 1}
                    orb={space.color}
                    title={space.name}
                  />
                )
              })}
              <RowItem
                orb={['#eee', '#eee']}
                title="Create new space..."
                titleProps={{
                  fontWeight: 400,
                  size: 1,
                  alpha: 0.8,
                }}
                after={<Icon name="addcircle" size={14} fill="#444" />}
                hover={false}
              />
            </View>
          </Col>
        </Popover>
      </FocusableShortcutHandler>
    )
  }
}

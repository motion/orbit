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

type Props = {
  paneManagerStore?: PaneManagerStore
  spaceStore?: SpaceStore
} & React.HTMLProps<HTMLDivElement> &
  CSSPropertySet

class SpaceSwitchStore {
  props: Props
  selectedIndex = 0
  get spaces() {
    return this.props.spaceStore.spaces
  }

  down = () => {
    this.selectedIndex = Math.min(this.selectedIndex + 1, this.spaces.length - 1)
  }

  up = () => {
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

    return (
      <Popover
        ref={this.spaceSwitcherRef}
        delay={100}
        openOnClick
        openOnHover
        closeOnClick
        closeOnClickAway
        theme="light"
        width={200}
        background
        adjust={[66, 0]}
        borderRadius={6}
        elevation={6}
        group="filters"
        target={
          <NavButton chromeless {...props}>
            <OrbitOrb size={16} background={'#DDADDA'} color="#985FC9" />
          </NavButton>
        }
      >
        {shown => {
          return (
            <FocusableShortcutHandler
              shortcuts={shortcuts}
              handlers={handlers}
              focused={shown}
              style={{ flex: 1 }}
            >
              <Col borderRadius={6} overflow="hidden" flex={1}>
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
              </Col>
            </FocusableShortcutHandler>
          )
        }}
      </Popover>
    )
  }
}

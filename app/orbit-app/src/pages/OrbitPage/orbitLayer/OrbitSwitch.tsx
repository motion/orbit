import * as React from 'react'
import { view, ensure, attach } from '@mcro/black'
import { Popover, View, Col, Row } from '@mcro/ui'
import { reaction, trace } from 'mobx'
import { App } from '@mcro/stores'
import { findDOMNode } from 'react-dom'
import { AppActions } from '../../../actions/AppActions'
import { getTargetPosition } from '../../../helpers/getTargetPosition'
import { PaneManagerStore } from '../../../stores/PaneManagerStore'
import * as Views from '../../../views'
import { NavButton } from '../../../views/NavButton'
import { OrbitIcon } from '../../../views/OrbitIcon'
import { CSSPropertySet, Theme } from '@mcro/gloss'
import { RowItem } from '../../../views/RowItem'
import { FocusableShortcutHandler } from '../../../views/FocusableShortcutHandler'
import { fuzzyQueryFilter } from '../../../helpers'
import { Icon } from '../../../views/Icon'
import { SpaceStore } from '../../../stores/SpaceStore'
import { OrbitOrb } from '../../../views/OrbitOrb'

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
  query = ''

  setOpen = open => {
    this.open = open
    if (this.popoverContentRef.current) {
      this.popoverContentRef.current.focus()
    }
  }

  get filteredSpaces() {
    return fuzzyQueryFilter(this.query, this.props.spaceStore.inactiveSpaces)
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

@attach('spaceStore', 'paneManagerStore')
@attach({
  store: SpaceSwitchStore,
})
@view
export class OrbitSwitch extends React.Component<Props> {
  spaceSwitcherRef = React.createRef<Popover>()

  spaceOpener = reaction(
    () => App.state.showSpaceSwitcher,
    () => {
      ensure('this.spaceSwitcherRef.current', !!this.spaceSwitcherRef.current)
      this.spaceSwitcherRef.current.toggleOpen()
    },
  )

  componentWillUnmount() {
    this.spaceOpener()
  }

  shortcuts = {
    select: 'enter',
    up: 'up',
    down: 'down',
  }

  handlers = {
    select: () => {
      console.log('should switch space')
      // switch active space
    },
    down: this.props.store.down,
    up: this.props.store.up,
  }

  createNewSpace = () => {
    AppActions.togglePeekApp({
      appConfig: {
        type: 'newSpace',
        title: 'New Space',
        icon: 'orbit',
      },
      target: findDOMNode(this) as HTMLDivElement,
    })
  }

  render() {
    const { paneManagerStore, spaceStore, store, ...props } = this.props
    const { activeSpace } = spaceStore
    const { selectedIndex, filteredSpaces } = store
    const borderRadius = 8
    trace()

    return (
      <FocusableShortcutHandler
        focused={store.open}
        shortcuts={this.shortcuts}
        handlers={this.handlers}
      >
        <Popover
          ref={this.spaceSwitcherRef}
          delay={100}
          openOnClick
          openOnHover
          // closeOnClick
          // closeOnClickAway
          theme="light"
          width={300}
          background
          adjust={[116, 0]}
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
            <Theme name="light">
              <View padding={5}>
                <Row background="#eee">
                  <Icon name="search" size={12} />
                  <Views.InputRow
                    label="Search..."
                    value={store.query}
                    onChange={value => store.query = value}
                  />
                  <View tagName="input" placeholder="Search..." />
                </Row>
              </View>
            </Theme>
            <View overflowY="auto" maxHeight={300}>
              { activeSpace ? <RowItem
                orb={activeSpace.colors}
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
              /> : <div>No spaces</div> }
              <View flex={1} margin={[2, 10]} background="#eee" height={1} />
              {filteredSpaces.map((space, index) => {
                return (
                  <RowItem
                    onClick={() => spaceStore.activeIndex = index}
                    key={space.name}
                    selected={selectedIndex === index + 1}
                    orb={space.color}
                    title={space.name}
                    {...space.props}
                  />
                )
              })}
              <RowItem
                onClick={this.createNewSpace}
                key='new-space'
                title='Create new space...'
                titleProps={{ fontWeight: 400, size: 1, alpha: 0.8 }}
                after={
                  <Icon name="addcircle" size={14} fill="#444" />
                }
              />
            </View>
          </Col>
        </Popover>
      </FocusableShortcutHandler>
    )
  }
}
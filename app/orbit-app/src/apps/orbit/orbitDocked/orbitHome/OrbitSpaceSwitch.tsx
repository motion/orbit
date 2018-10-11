import * as React from 'react'
import { view } from '@mcro/black'
import { Popover, View, Col, Row, Button, Theme } from '@mcro/ui'
import { reaction } from 'mobx'
import { App } from '@mcro/stores'
import { PaneManagerStore } from '../../PaneManagerStore'
import { NavButton } from '../../../../views/NavButton'
import { RowItem } from '../../orbitHeader/RowItem'
import { OrbitIcon } from '../../../../views/OrbitIcon'
import { OrbitOrb } from '../orbitSettings/OrbitOrb'
import { CSSPropertySet } from '@mcro/gloss'

type Props = { paneManagerStore?: PaneManagerStore } & React.HTMLProps<HTMLDivElement> &
  CSSPropertySet

@view.attach('paneManagerStore')
@view
export class OrbitSpaceSwitch extends React.Component<Props> {
  spaceSwitcherRef = React.createRef<Popover>()

  spaceOpener = reaction(
    () => App.state.showSpaceSwitcher,
    () => {
      console.log(this.spaceSwitcherRef.current)
      this.spaceSwitcherRef.current.toggleOpen()
    },
  )

  componenWillUnmount() {
    this.spaceOpener()
  }

  render() {
    const { paneManagerStore, ...props } = this.props
    return (
      <Popover
        ref={this.spaceSwitcherRef}
        delay={100}
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
        <Col borderRadius={6} overflow="hidden" flex={1}>
          <RowItem
            orb="blue"
            title="Orbit"
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
          <RowItem orb="grey" title="Me" />
          <RowItem orb="red" title="discuss-things" />

          <Row margin={5} alignItems="center">
            <View flex={1} />
            <Theme theme={{ background: '#fff', color: '#444' }}>
              <Button ignoreSegment icon="add">
                Create
              </Button>
            </Theme>
          </Row>
        </Col>
      </Popover>
    )
  }
}

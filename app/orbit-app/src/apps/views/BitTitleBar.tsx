import * as React from 'react'
import { Row, SegmentedRow, Text, View } from '@mcro/ui'
import { OrbitAppMainProps } from '../types'
import { TitleBarSpace } from '../views/TitleBarSpace'
import { TitleBarButton } from '../views/TitleBarButton'
import { Actions } from '../../actions/Actions'
import { OrbitIcon } from '../../views/OrbitIcon'

export class BitTitleBar extends React.Component<OrbitAppMainProps<'slack'>> {
  render() {
    const { searchBar, normalizedItem } = this.props
    const { title, icon, location, locationLink, desktopLink, webLink } = normalizedItem
    return (
      <>
        <View position="absolute" top={3} left={0} right={0} alignItems="center">
          <Text size={0.85} fontWeight={600} alignItems="center">
            {title}
          </Text>
        </View>
        <Row alignItems="center" height={38} margin={[5, 0, 0]}>
          {searchBar}
          <TitleBarSpace />
          <SegmentedRow>
            <TitleBarButton
              onClick={() => {
                Actions.open(locationLink)
                Actions.closeOrbit()
              }}
              icon={<OrbitIcon icon={icon} size={16} />}
              tooltip={location}
            />
            <TitleBarButton
              onClick={() => {
                Actions.open(desktopLink || webLink)
                Actions.closeOrbit()
              }}
              tooltip="Open"
            >
              Open
            </TitleBarButton>
          </SegmentedRow>
        </Row>
      </>
    )
  }
}

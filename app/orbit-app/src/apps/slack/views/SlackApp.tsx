import * as React from 'react'
import { OrbitAppMainProps } from '../../types'
import { ScrollableContent } from '../../views/ScrollableContent'
import { Row, SegmentedRow, Surface } from '@mcro/ui'
import { TitleBarSpace } from '../../views/TitleBarSpace'
import { TitleBarButton } from '../../views/TitleBarButton'
import { Actions } from '../../../actions/Actions'
import { normalizeItem } from '../../../components/ItemResolver'
import { OrbitIcon } from '../../../views/OrbitIcon'

export class SlackApp extends React.Component<OrbitAppMainProps<'slack'>> {
  render() {
    const { searchBar, bit } = this.props
    const { icon, location, locationLink, desktopLink, webLink } = normalizeItem(bit)

    return (
      <Surface flexFlow="column" hover={false} noInnerElement padding={16} flex={1}>
        <Row flex={1}>
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
        <ScrollableContent>123</ScrollableContent>
      </Surface>
    )
  }
}

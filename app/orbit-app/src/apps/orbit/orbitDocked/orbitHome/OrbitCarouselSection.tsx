import * as React from 'react'
import { view } from '@mcro/black'
import {
  SelectableCarousel,
  SelectableCarouselProps,
} from '../../../../components/SelectableCarousel'
import { OrbitSection } from './OrbitSection'
import { Unpad } from '../../../../views/Unpad'
import { handleClickLocation } from '../../../../helpers/handleClickLocation'
import { SubPaneStore } from '../../SubPaneStore'

type Props = SelectableCarouselProps & {
  categoryName?: string
  margin?: number
  subPaneStore?: SubPaneStore
}

@view.attach('subPaneStore')
export class OrbitCarouselSection extends React.Component<Props> {
  shouldComponentUpdate() {
    return false
  }

  render() {
    const { subPaneStore, offset, items, categoryName, cardProps, margin, ...props } = this.props
    if (!items.length) {
      return null
    }
    const isPeople = categoryName === 'People'
    return (
      <OrbitSection
        title={categoryName}
        alignItems="center"
        padding={[offset === 0 ? 0 : 2, 0, 0]}
        margin={margin || [0, 0, -2]}
      >
        <Unpad>
          <SelectableCarousel
            items={items}
            offset={offset}
            horizontalPadding={10}
            isActiveStore={subPaneStore}
            resetOnInactive
            cardProps={{
              titleFlex: 1,
              onClickLocation: handleClickLocation,
              ...cardProps,
              hide: {
                body: true,
                icon: isPeople,
                ...(cardProps ? cardProps.hide : null),
              },
              titleProps: {
                ellipse: true,
                maxWidth: isPeople ? 'calc(100% - 44px)' : null,
                ...(cardProps ? cardProps.titleProps : null),
              },
            }}
            {...props}
          />
        </Unpad>
      </OrbitSection>
    )
  }
}

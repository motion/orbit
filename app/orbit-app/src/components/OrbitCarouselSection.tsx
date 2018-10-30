import * as React from 'react'
import { attach } from '@mcro/black'
import { SelectableCarousel, SelectableCarouselProps } from './SelectableCarousel'
import { Section } from './Section'
import { Unpad } from '../views/Unpad'
import { handleClickLocation } from '../helpers/handleClickLocation'
import { SubPaneStore } from './SubPaneStore'

type Props = SelectableCarouselProps & {
  categoryName?: string
  margin?: number
  subPaneStore?: SubPaneStore
}

@attach('subPaneStore')
export class OrbitCarouselSection extends React.Component<Props> {
  shouldComponentUpdate() {
    return false
  }

  render() {
    const { subPaneStore, offset, items, categoryName, cardProps, margin, ...props } = this.props
    if (!items.length) {
      return null
    }
    const isPeople = categoryName === 'Directory'
    return (
      <Section
        title={categoryName}
        type="carousel"
        margin={margin || [0, 0, -2]}
        alignItems="center"
        padding={[offset === 0 ? 0 : 2, 0, 0]}
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
      </Section>
    )
  }
}

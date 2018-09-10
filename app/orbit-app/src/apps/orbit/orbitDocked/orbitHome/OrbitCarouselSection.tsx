import * as React from 'react'
import { view, compose } from '@mcro/black'
import { SelectableCarousel } from '../../../../components/SelectableCarousel'
import { OrbitSection } from './OrbitSection'
import { Unpad } from '../../../../views/Unpad'

const decorator = compose(
  view.attach('subPaneStore'),
  view,
)

export const OrbitCarouselSection = decorator(
  ({ subPaneStore, startIndex, items, categoryName, ...props }) => {
    const isPeople = categoryName === 'People'
    return (
      <OrbitSection
        title={categoryName}
        alignItems="center"
        padding={[startIndex === 0 ? 4 : 8, 0, 0]}
      >
        <Unpad>
          <SelectableCarousel
            items={items}
            offset={startIndex}
            horizontalPadding={10}
            isActiveStore={subPaneStore}
            resetOnInactive
            cardProps={{
              hide: {
                body: !isPeople,
                icon: isPeople,
              },
              titleFlex: 1,
              titleProps: isPeople ? { ellipse: true } : null,
            }}
            {...props}
          />
        </Unpad>
      </OrbitSection>
    )
  },
)

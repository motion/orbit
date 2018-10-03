import * as React from 'react'
import { view, compose } from '@mcro/black'
import { SelectableCarousel } from '../../../../components/SelectableCarousel'
import { OrbitSection } from './OrbitSection'
import { Unpad } from '../../../../views/Unpad'
import { handleClickLocation } from '../../../../helpers/handleClickLocation'

const decorator = compose(
  view.attach('subPaneStore'),
  view,
)

export const OrbitCarouselSection = decorator(
  ({ subPaneStore, startIndex, items, categoryName, cardProps, ...props }) => {
    if (!items.length) {
      return null
    }
    const isPeople = categoryName === 'People'
    return (
      <OrbitSection
        title={categoryName}
        alignItems="center"
        padding={[startIndex === 0 ? 4 : 6, 0, 0]}
        marginBottom={-2}
      >
        <Unpad>
          <SelectableCarousel
            items={items}
            offset={startIndex}
            horizontalPadding={10}
            isActiveStore={subPaneStore}
            resetOnInactive
            cardProps={{
              titleFlex: 1,
              onClickLocation: handleClickLocation,
              ...cardProps,
              hide: {
                body: !isPeople,
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
  },
)

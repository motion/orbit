import * as React from 'react'
import { default as SelectableCarousel, SelectableCarouselProps } from './SelectableCarousel'
import { Section } from '../views/Section'
import { Unpad } from '../views/Unpad'
import { handleClickLocation } from '../helpers/handleClickLocation'
import { SubPaneStore } from './SubPaneStore'
import { useStoresSafe } from '../hooks/useStoresSafe'
import { observer } from 'mobx-react-lite'

type Props = SelectableCarouselProps & {
  categoryName?: string
  margin?: number
  subPaneStore?: SubPaneStore
}

export const OrbitCarouselSection = observer(
  ({ offset, items, categoryName, cardProps, margin, ...props }: Props) => {
    const { subPaneStore } = useStoresSafe()
    if (!items || !items.length) {
      return null
    }
    const isPeople = categoryName === 'Directory'
    return (
      <Section
        title={`${categoryName}`}
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
  },
)

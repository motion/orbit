import { observer } from 'mobx-react-lite'
import * as React from 'react'
import { useStores } from '../hooks/useStores'
import { Section } from '../views/Section'
import { Unpad } from '../views/Unpad'
import { default as SelectableCarousel, SelectableCarouselProps } from './SelectableCarousel'
import { SubPaneStore } from './SubPaneStore'

type Props = SelectableCarouselProps & {
  categoryName?: string
  margin?: number
  subPaneStore?: SubPaneStore
}

export const OrbitCarouselSection = observer(
  ({ offset, items, categoryName, cardProps, margin, ...props }: Props) => {
    const { subPaneStore } = useStores()
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
              // TODO restore...
              // onClickLocation: handleClickLocation,
              ...cardProps,
              hideBody: true,
              hideIcon: isPeople,
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

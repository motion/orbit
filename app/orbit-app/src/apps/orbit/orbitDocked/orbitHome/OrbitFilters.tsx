import * as React from 'react'
import { view, compose } from '@mcro/black'
import { RoundButton } from '../../../../views'
import { OrbitIcon } from '../../../../views/OrbitIcon'
import { SearchStore } from '../SearchStore'

type Props = {
  searchStore?: SearchStore
}

const IntegrationFiltersRow = view({
  flexFlow: 'row',
  alignItems: 'center',
  padding: 1,
})

const decorate = compose(
  view.attach('searchStore'),
  view,
)
export const OrbitFilters = decorate(({ searchStore }: Props) => {
  const { searchFilterStore } = searchStore
  const hasActiveFilters = !!searchFilterStore.integrationFilters.find(x => x.active)
  return (
    <>
      {searchFilterStore.integrationFilters.length > 1 && (
        <IntegrationFiltersRow>
          {searchFilterStore.integrationFilters.map((filter, i) => {
            return (
              <RoundButton
                key={`${filter.icon}${i}`}
                circular
                glint={false}
                sizeHeight={0.9}
                margin={[0, 3]}
                icon={<OrbitIcon size={18} icon={filter.icon} />}
                tooltip={filter.name}
                onClick={searchFilterStore.integrationFilterToggler(filter)}
                background="transparent"
                transformOrigin="center center"
                transition="transform ease 150ms"
                {...filter.active && {
                  opacity: 1,
                }}
                {...hasActiveFilters &&
                  !filter.active && {
                    opacity: 0.5,
                  }}
                activeStyle={{
                  background: 'transparent',
                }}
                hoverStyle={{
                  filter: 'none',
                  opacity: filter.active ? 1 : 0.75,
                }}
              />
            )
          })}
        </IntegrationFiltersRow>
      )}
    </>
  )
})

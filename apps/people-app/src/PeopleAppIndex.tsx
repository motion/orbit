import { useModels } from '@o/bridge'
import { List, NoResultsDialog, useShareMenu, useStores } from '@o/kit'
import { BitModel } from '@o/models'
import React, { useCallback } from 'react'

export function PeopleAppIndex() {
  // people and query

  // TODO reduce all this mess down
  const { queryStore } = useStores()
  const { appFilters } = queryStore.queryFilters
  const { getShareMenuItemProps } = useShareMenu()
  let where = []
  if (appFilters.length) {
    for (const filter of appFilters) {
      if (filter.active) {
        where.push({
          type: 'person',
          identifier: filter.app, // todo: make sure it works
        })
      }
    }
  }
  if (!where.length) {
    where.push({ type: 'person' })
  }
  const [people] = useModels(BitModel, { take: 50000, where })

  if (!people.length) {
    return <NoResultsDialog subName="the directory" />
  }

  return (
    <List
      getItemProps={(a, b, c) => {
        return {
          ...getShareMenuItemProps(a, b, c),
        }
      }}
      items={people}
      filterKey="name"
      removePrefix="@"
      sortBy={useCallback(x => x.title.toLowerCase(), [])}
      groupByLetter
      groupMinimum={12}
    />
  )
}

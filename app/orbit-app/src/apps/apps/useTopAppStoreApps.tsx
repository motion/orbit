import { ListItemProps, SubTitle } from '@o/ui'
import React, { useEffect, useState } from 'react'

import { appSearchToListItem, FilterSearchItems } from './AppsApp'

export function useTopAppStoreApps(
  filterFn: FilterSearchItems = _ => _,
  fallback: ListItemProps = {
    selectable: false,
    children: <SubTitle>Loading app store</SubTitle>,
  },
): ListItemProps[] {
  const [topApps, setTopApps] = useState([])

  useEffect(() => {
    let cancelled = false
    fetch(`https://tryorbit.com/api/apps`)
      .then(res => res.json())
      .then(res => {
        if (!cancelled) {
          setTopApps(res)
        }
      })
    return () => {
      cancelled = true
    }
  }, [])

  const filtered = filterFn(topApps || [])
  const withFallback = filtered.length ? filtered.map(appSearchToListItem) : [fallback]
  return withFallback.map(x => ({
    ...x,
    groupName: 'Trending (App Store)',
  }))
}

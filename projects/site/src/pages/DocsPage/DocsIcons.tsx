import { allIcons, Col, fuzzyFilter, Grid, Icon, SimpleText } from '@o/ui'
import React, { useEffect, useState } from 'react'

import { SearchInput } from '../../views/SearchInput'

export let Simple = (
  //
  <Icon name="cog" size={64} />
)

const iconElementsObj = allIcons.reduce((acc, cur) => {
  acc[cur.iconName] = (
    <Col
      key={cur.iconName}
      alignContent="center"
      justifyContent="center"
      width={64}
      height={64}
      padding={4}
    >
      <Icon size={32} name={cur.iconName} />
      <SimpleText size={0.9}>{cur.iconName}</SimpleText>
    </Col>
  )
  return acc
}, {})

const allIconsList = Object.keys(iconElementsObj).map(k => iconElementsObj[k])

export let DocsIconSearch = () => {
  let [search, setSearch] = useState('')
  let [results, setResults] = useState(allIconsList)

  useEffect(() => {
    if (!search) return
    const next = fuzzyFilter(search, allIcons, {
      limit: 10000,
      keys: ['iconName', 'displayName', 'tags', 'group'],
    })
    console.log('next', search, next)
    setResults(next.map(x => iconElementsObj[x.iconName]))
  }, [search])

  return (
    <>
      <SearchInput onChange={e => setSearch(e.target.value)} />

      <Col pad>
        <Grid height={400} scrollable="y" space="xl" itemMinWidth={64}>
          {search ? results : allIconsList}
        </Grid>
      </Col>
    </>
  )
}

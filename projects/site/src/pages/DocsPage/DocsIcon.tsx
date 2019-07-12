import { allIcons, Col, fuzzyFilter, Grid, Icon, SimpleText, Space } from '@o/ui'
import React, { useEffect, useState } from 'react'

import { SearchInput } from '../../views/SearchInput'

export let Simple = (
  //
  <Icon name="cog" size={64} />
)

const dim = 100
const iconElementsObj = allIcons.reduce((acc, cur) => {
  acc[cur.iconName] = (
    <Col
      key={cur.iconName}
      alignItems="center"
      justifyContent="center"
      textAlign="center"
      width={dim}
      height={dim}
      padding={4}
    >
      <Icon size={32} name={cur.iconName} />
      <Space />
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
    setResults(next.map(x => iconElementsObj[x.iconName]))
  }, [search])

  return (
    <>
      <SearchInput onChange={e => setSearch(e.target.value)} />

      <Col padding>
        <Grid height={630} scrollable="y" space="xl" itemMinWidth={dim}>
          {search ? results : allIconsList}
        </Grid>
      </Col>
    </>
  )
}

import { Row, View } from '@mcro/gloss'
import { AppWithSource, getItemName, useJobs, useSourceInfo } from '@mcro/kit'
import { HorizontalSpace, Text } from '@mcro/ui'
import pluralize from 'pluralize'
import React from 'react'

/**
 * Cache of bitCount to prevent bitCounts from flickering.
 */
const bitsCountCache = {}

export const OrbitSourceInfo = ({ definition, source }: AppWithSource) => {
  const sourceId = source ? source.id : false
  const { bitsCount } = useSourceInfo(source)
  const allJobs = useJobs(sourceId)
  const isSyncing = !!(allJobs && allJobs.activeJobs && allJobs.activeJobs.length)

  if (!sourceId) {
    return null
  }

  if (bitsCount !== 0) {
    bitsCountCache[sourceId] = bitsCount
  }
  const countSubtitle = shortNumber(bitsCount === 0 ? bitsCountCache[sourceId] || 0 : bitsCount)

  return (
    <Row alignItems="center" flex={1}>
      <View flex={1} justifyContent="center">
        <Text size={0.9} alpha={0.5} ellipse>
          {definition.name}&nbsp;·&nbsp;
          {countSubtitle}&nbsp;{pluralize(getItemName(definition.itemType), countSubtitle)}
        </Text>
      </View>
      <HorizontalSpace />
      {!!isSyncing && (
        <Text size={0.9} alpha={0.75}>
          Syncing...
        </Text>
      )}
    </Row>
  )
}

function shortNumber(num: number) {
  const countSubtitle = num >= 0 ? Number(num).toLocaleString() : '...'
  const commaIndex = countSubtitle.indexOf(',')
  return commaIndex > -1 ? `${countSubtitle.slice(0, commaIndex)}k` : countSubtitle
}

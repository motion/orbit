import * as React from 'react'
import { useSourceInfo } from '../hooks/useSourceInfo'
import { useJobs } from '../hooks/useJobs'
import { Text, Row, View } from '@mcro/ui'
import { OrbitIntegration } from '../sources/types'
import pluralize from 'pluralize'

type Props = {
  sourceId: number
  app?: OrbitIntegration<any>
}

export const OrbitAppInfo = (props: Props) => {
  const sourceId = props.app.source ? props.app.source.id : false
  const { bitsCount } = useSourceInfo(sourceId)
  const allJobs = useJobs(sourceId)
  const isSyncing = !!(allJobs && allJobs.activeJobs && allJobs.activeJobs.length)

  if (!sourceId) {
    return null
  }

  const countSubtitle = shortNumber(bitsCount)

  return (
    <Row alignItems="center" flex={1}>
      <Text size={0.9}>
        {countSubtitle}&nbsp;{pluralize(props.app.display.itemName || 'item', countSubtitle)}
      </Text>
      <View flex={1} />
      {!!isSyncing && (
        <Text size={0.9} alpha={0.8}>
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

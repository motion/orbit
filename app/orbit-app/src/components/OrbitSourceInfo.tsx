import { Row, Text, View } from '@mcro/ui'
import pluralize from 'pluralize'
import * as React from 'react'
import { useJobs } from '../hooks/useJobs'
import { useSourceInfo } from '../hooks/useSourceInfo'
import { OrbitIntegration } from '../sources/types'
import { HorizontalSpace } from '../views'

type Props = {
  sourceId: number
  app?: OrbitIntegration<any>
}

export const OrbitSourceInfo = (props: Props) => {
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
      <View flex={1} justifyContent="center">
        <Text size={0.9} alpha={0.5} ellipse>
          {props.app.appName}&nbsp;·&nbsp;
          {countSubtitle}&nbsp;{pluralize(props.app.display.itemName || 'item', countSubtitle)}
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

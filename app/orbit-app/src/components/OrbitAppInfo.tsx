import * as React from 'react'
import { AppInfoProps } from './AppInfoStore'
import { useJobs } from '../hooks/useJobs'
import { Text, Row, View } from '@mcro/ui'
import { OrbitIntegration } from '../sources/types'
import pluralize from 'pluralize'
import { useObserveCount } from '@mcro/model-bridge'
import { BitModel } from '@mcro/models'

type Props = AppInfoProps & {
  app?: OrbitIntegration<any>
}

export const OrbitAppInfo = (props: Props) => {
  const sourceId = props.app.source ? props.app.source.id : null
  if (!sourceId) {
    return null
  }

  const bitsCount = useObserveCount(BitModel, {
    where: {
      sourceId,
    },
  })
  const countSubtitle = shortNumber(bitsCount)
  const isSyncing = !!useJobs(sourceId).activeJobs.length

  return (
    <Row alignItems="center">
      {isSyncing && (
        <>
          <Text size={0.9} alpha={0.8}>
            Syncing...
          </Text>
          <View flex={1} />
        </>
      )}
      <Text size={0.9}>
        {countSubtitle}&nbsp;{pluralize(props.app.display.itemName || 'item', countSubtitle)}
      </Text>
    </Row>
  )
}

function shortNumber(num: number) {
  const countSubtitle = num >= 0 ? Number(num).toLocaleString() : '...'
  const commaIndex = countSubtitle.indexOf(',')
  return commaIndex > -1 ? `${countSubtitle.slice(0, commaIndex)}k` : countSubtitle
}

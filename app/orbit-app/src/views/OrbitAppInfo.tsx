import { AppWithDefinition, getItemName, useAppSyncState, useJobs } from '@o/kit'
import { Stack, Text, View } from '@o/ui'
import pluralize from 'pluralize'
import React from 'react'

/**
 * Cache of bitCount to prevent bitCounts from flickering.
 */
const bitsCountCache = {}

export const OrbitAppInfo = ({ definition, app }: AppWithDefinition) => {
  const appId = app ? app.id : false
  const { bitsCount } = useAppSyncState(app)
  const allJobs = useJobs(appId)
  const isSyncing = !!(allJobs && allJobs.activeJobs && allJobs.activeJobs.length)

  if (!appId) {
    return <>no app id</>
  }

  if (bitsCount !== 0) {
    bitsCountCache[appId] = bitsCount
  }
  const countSubtitle = shortNumber(bitsCount === 0 ? bitsCountCache[appId] || 0 : bitsCount)

  return (
    <Stack direction="horizontal" alignItems="center" flex={1}>
      <View flex={1} justifyContent="center">
        <Text size={0.9} alpha={0.5} ellipse>
          {definition.name}&nbsp;·&nbsp;
          {countSubtitle}&nbsp;{pluralize(getItemName(definition.itemType), countSubtitle)}
        </Text>
      </View>
      <Text size={0.9} alpha={0.75}>
        {!!isSyncing ? 'Syncing...' : <>&nbsp;</>}
      </Text>
    </Stack>
  )
}

function shortNumber(num: number) {
  const countSubtitle = num >= 0 ? Number(num).toLocaleString() : '...'
  const commaIndex = countSubtitle.indexOf(',')
  return commaIndex > -1 ? `${countSubtitle.slice(0, commaIndex)}k` : countSubtitle
}

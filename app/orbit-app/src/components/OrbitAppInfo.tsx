import * as React from 'react'
import { AppInfoStore, AppInfoProps } from './AppInfoStore'
// import { SyncStatus } from './SyncStatus'
import { Text, Icon, Row, View } from '@mcro/ui'
import { OrbitIntegration } from '../sources/types'
import pluralize from 'pluralize'
import { useStore } from '@mcro/use-store'
import { observer } from 'mobx-react-lite'

type Props = AppInfoProps & {
  app?: OrbitIntegration<any>
}

export const OrbitAppInfo = observer((props: Props) => {
  const store = useStore(AppInfoStore, props)
  let countSubtitle = store.bitsCount >= 0 ? Number(store.bitsCount).toLocaleString() : '...'
  const commaIndex = countSubtitle.indexOf(',')
  countSubtitle = commaIndex > -1 ? `${countSubtitle.slice(0, commaIndex)}k` : countSubtitle
  return (
    // <SyncStatus sourceId={props.app.source ? props.app.source.id : null}>
    //   {syncJobs => {
    // return (
    <Row alignItems="center">
      <Text size={0.85} alpha={0.6}>
        {countSubtitle} {pluralize(props.app.display.itemName || 'item', countSubtitle)}
      </Text>
      <View flex={1} />
      {/* {!!syncJobs.length && <Icon size={12} opacity={0.5} name="refresh" />} */}
      <Icon
        size={12}
        opacity={0.5}
        name="remove"
        onClick={e => {
          e.stopPropagation()
          alert('Are you sure?')
        }}
      />
    </Row>
    // )
    //   }}
    // </SyncStatus>
  )
})

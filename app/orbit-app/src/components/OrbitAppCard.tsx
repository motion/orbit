import * as React from 'react'
import { view, compose, attach } from '@mcro/black'
import { OrbitCard } from '../views/OrbitCard'
import { AppInfoStore, AppInfoProps } from './AppInfoStore'
import { ItemProps } from '../views/OrbitItemProps'
import { SyncStatus } from './SyncStatus'
import { Text, Icon } from '@mcro/ui'
import { Source } from '@mcro/models'
import { OrbitIntegration } from '../integrations/types'
import { sourceToAppConfig } from '../stores/SourcesStore'
import pluralize from 'pluralize'

type Props = ItemProps<Source> &
  AppInfoProps & {
    app?: OrbitIntegration<any>
    store: AppInfoStore
  }

const decorator = compose(
  attach({
    store: AppInfoStore,
  }),
  view,
)

export const OrbitAppCard = decorator(({ store, app, appConfig, subtitle, ...props }: Props) => {
  let countSubtitle = store.bitsCount >= 0 ? Number(store.bitsCount).toLocaleString() : '...'
  const commaIndex = countSubtitle.indexOf(',')
  countSubtitle = commaIndex > -1 ? `${countSubtitle.slice(0, commaIndex)}k` : countSubtitle
  console.log("app", app)
  return (
    <OrbitCard
      direct
      model={app.source}
      title={app.appName}
      titleProps={{
        ellipse: true,
      }}
      icon={app.display.icon}
      appConfig={
        appConfig || {
          ...sourceToAppConfig(app),
          type: 'source',
          viewConfig: {
            ...app.viewConfig,
            dimensions: [620, 620],
            initialState: {
              active: 'sources',
            },
          },
        }
      }
      subtitle={typeof subtitle !== 'undefined' ? subtitle : app.display.name}
      titleFlex={1}
      date={store.job && store.job.updatedAt}
      iconProps={{
        size: 20,
      }}
      {...props}
    >
      <SyncStatus sourceId={app.source ? app.source.id : null}>
        {(syncJobs, removeJobs) => {
          return (
            <>
              <Text size={0.85} alpha={0.6}>
                {countSubtitle} {pluralize(app.display.itemName || 'item', countSubtitle)}
                {syncJobs.length ? (
                  <Icon size={12} name="refresh" />
                ) : removeJobs.length ? (
                  <Icon size={12} name="refresh" />
                ) : (
                  ''
                )}
              </Text>
            </>
          )
        }}
      </SyncStatus>
    </OrbitCard>
  )
})

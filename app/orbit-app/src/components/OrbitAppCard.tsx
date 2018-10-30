import * as React from 'react'
import { view, compose, attach } from '@mcro/black'
import { OrbitCard } from '../views/OrbitCard'
import { AppInfoStore, AppInfoProps } from './AppInfoStore'
import { ItemProps } from '../views/OrbitItemProps'
import { SyncStatus } from './SyncStatus'
import { Text, Icon } from '@mcro/ui'
import { Setting } from '@mcro/models'
import { OrbitIntegration } from '../integrations/types'
import { appToAppConfig } from '../stores/AppsStore'
import pluralize from 'pluralize'

type Props = ItemProps<Setting> &
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
  return (
    <OrbitCard
      direct
      model={app.setting}
      title={app.appName}
      titleProps={{
        ellipse: true,
      }}
      icon={app.display.icon}
      appConfig={
        appConfig || {
          ...appToAppConfig(app),
          type: 'setting',
          viewConfig: {
            ...app.viewConfig,
            dimensions: [620, 620],
            initialState: {
              active: 'settings',
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
      <SyncStatus settingId={app.setting ? app.setting.id : null}>
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

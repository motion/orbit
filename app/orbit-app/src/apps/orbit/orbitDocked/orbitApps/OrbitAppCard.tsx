import * as React from 'react'
import { view, compose } from '@mcro/black'
import { OrbitCard } from '../../../../views/OrbitCard'
import { AppInfoStore, AppInfoProps } from '../../../../stores/AppInfoStore'
import { OrbitItemProps } from '../../../../views/OrbitItemProps'
import { SyncStatus } from '../views/SyncStatus'
import { Text } from '@mcro/ui'
// import { SyncStatus } from '../views/SyncStatus';
// import { Row, Col } from '@mcro/ui'
// import { RoundButtonSmall } from '../../../../views/RoundButtonSmall'

type Props = OrbitItemProps &
  AppInfoProps & {
    store: AppInfoStore
    isActive?: boolean
  }

const decorator = compose(
  view.attach({
    store: AppInfoStore,
  }),
  view,
)

export const OrbitAppCard = decorator(
  ({ settingId, store, result, isActive, subtitle, ...props }: Props) => {
    const countSubtitle = !isActive
      ? ''
      : store.bitsCount >= 0
        ? Number(store.bitsCount).toLocaleString()
        : '...'
    const subtitleDisplay = subtitle || countSubtitle
    return (
      <OrbitCard
        inactive={!isActive}
        title={result.title}
        titleProps={{
          ellipse: true,
        }}
        subtitle={subtitleDisplay}
        subtitleProps={{
          size: 1.5,
          fontWeight: 300,
        }}
        titleFlex={1}
        date={store.job && store.job.updatedAt}
        icon={result.icon}
        iconProps={{
          size: 20,
        }}
        padding={8}
        result={result}
        {...props}
      >
        {/* this will be so you can go straight to the individual home screen */}
        {/* for this integration which will pre-populate with location rows */}
        {/* <Row>
          <Col flex={1} />
          <RoundButtonSmall>View</RoundButtonSmall>
        </Row> */}
        <SyncStatus settingId={settingId}>
          {jobs => {
            return (
              <Text size={0.9} alpha={0.6}>
                {jobs ? 'Syncing' : 'Ready'}
              </Text>
            )
          }}
        </SyncStatus>
      </OrbitCard>
    )
  },
)

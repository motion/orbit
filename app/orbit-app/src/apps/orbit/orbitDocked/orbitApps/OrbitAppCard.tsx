import * as React from 'react'
import { view, compose } from '@mcro/black'
import { OrbitCard } from '../../../../views/OrbitCard'
import { SettingInfoStore } from '../../../../stores/SettingInfoStore'
import { OrbitItemProps } from '../../../../views/OrbitItemProps'
import { Row, Col } from '@mcro/ui'
import { RoundButtonSmall } from '../../../../views/RoundButtonSmall'

type Props = OrbitItemProps & {
  store: SettingInfoStore
  isActive?: boolean
}

const decorator = compose(
  view.attach({
    store: SettingInfoStore,
  }),
  view,
)

export const OrbitAppCard = decorator(
  ({ store, result, isActive, subtitle, ...props }: Props) => {
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
        <Row>
          <Col flex={1} />
          <RoundButtonSmall>View</RoundButtonSmall>
        </Row>
      </OrbitCard>
    )
  },
)

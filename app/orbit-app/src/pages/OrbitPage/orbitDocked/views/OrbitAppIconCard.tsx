import * as React from 'react'
import { OrbitCard } from '../../../../views/OrbitCard'
import { AppInfoStore, AppInfoProps } from '../../../../stores/AppInfoStore'
import { OrbitItemProps } from '../../../../views/OrbitItemProps'
import { Setting } from '@mcro/models'
import { view } from '@mcro/black'
import { SubTitle } from '../../../../views/SubTitle'
import { Col, Surface, SizedSurface, Theme, Text } from '@mcro/ui'

type Props = OrbitItemProps<Setting> &
  AppInfoProps & {
    store: AppInfoStore
    isActive?: boolean
    hideTitle?: boolean
    model?: any
  }

const Centered = view({
  flex: 1,
  alignItems: 'center',
  justifyContent: 'center',
})

// {!hideTitle && (
//   <>
//     <div style={{ height: 2 }} />
//     <SyncStatus settingId={model.id}>
//       {(syncJobs, removeJobs) => {
//         return (
//           <Text size={0.85} alpha={0.6} ellipse>
//             {syncJobs.length ? 'Syncing...' : removeJobs.length ? 'Removing...' : name}
//           </Text>
//         )
//       }}
//     </SyncStatus>
//   </>
// )}

export const OrbitAppIconCard = (props: Props) => {
  const {
    store,
    hideTitle,
    model,
    isActive,
    subtitle,
    children = null,
    title,
    style,
    ...restProps
  } = props
  console.log('props are', props)
  const isSelected = model.title === 'Orbit'
  return (
    <Col
      marginRight={20}
      width={style.width}
      heigth={style.height + hideTitle ? 0 : 15}
      alignItems="center"
      justifyContent="center"
    >
      <OrbitCard
        chromeless
        isSelected={isSelected}
        direct
        style={style}
        padding={3}
        borderRadius={100}
        flex="none"
        {...restProps}
      >
        <Centered>{model.children}</Centered>
      </OrbitCard>
      <Theme name="semi-dark">
        <SizedSurface
          size={0.9}
          sizeRadius={3}
          height={17}
          maxWidth={style.width - 4}
          padding={[0, 6]}
          glint
          tooltip={model.title}
        >
          {!hideTitle && (
            <Text size={0.9} sizeLineHeight={0.9} ellipse>
              {model.title}
            </Text>
          )}
        </SizedSurface>
      </Theme>
    </Col>
  )
}

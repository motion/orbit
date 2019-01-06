import * as React from 'react'
import { OrbitCard } from '../../../../views/OrbitCard'
import { AppInfoStore, AppInfoProps } from '../../../../stores/AppInfoStore'
import { ItemProps } from '../../../../views/OrbitItemProps'
import { Setting } from '@mcro/models'
import { Col, SizedSurface, Theme, Text } from '@mcro/ui'
import { gloss } from '@mcro/gloss'

type Props = ItemProps<Setting> &
  AppInfoProps & {
    store: AppInfoStore
    isActive?: boolean
    hideTitle?: boolean
    model?: any
  }

const Centered = gloss({
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
  return (
    <Col
      marginRight={14}
      width={style.width}
      heigth={style.height + hideTitle ? 0 : 15}
      alignItems="center"
      justifyContent="center"
    >
      <OrbitCard
        direct
        opacity={0.75}
        activeStyle={{ opacity: 1 }}
        {...{
          '&:hover': {
            opacity: 1,
          },
        }}
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
          size={0.8}
          sizeRadius={3}
          height={17}
          maxWidth={style.width * 1.4}
          padding={[0, 4]}
          glint
          // tooltip={model.title}
        >
          {!hideTitle && !!model.title && (
            <Text size={0.85} sizeLineHeight={0.9} ellipse>
              {model.title}
            </Text>
          )}
        </SizedSurface>
      </Theme>
    </Col>
  )
}

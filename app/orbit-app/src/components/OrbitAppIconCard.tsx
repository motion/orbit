import * as React from 'react'
import { Col, SizedSurface, Theme, Text } from '@mcro/ui'
import { gloss } from '@mcro/gloss'
import { OrbitCard } from '../views/OrbitCard'
import { AppInfoProps, AppInfoStore } from './AppInfoStore'
import { OrbitItemViewProps } from '../sources/types'

type Props = OrbitItemViewProps<any> &
  AppInfoProps & {
    store: AppInfoStore
    isActive?: boolean
    hideTitle?: boolean
    model?: any
    style?: any
  }

const Centered = gloss({
  flex: 1,
  alignItems: 'center',
  justifyContent: 'center',
})

export const OrbitAppIconCard = (props: Props) => {
  const { store, hideTitle, model, isActive, style, ...restProps } = props
  return (
    <Col
      marginRight={14}
      width={style.width}
      heigth={style.height + hideTitle ? 0 : 15}
      alignItems="center"
      justifyContent="center"
    >
      <OrbitCard
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

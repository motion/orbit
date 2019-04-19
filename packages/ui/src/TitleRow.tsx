import { gloss } from '@o/gloss'
import React, { forwardRef, isValidElement } from 'react'
import { BorderBottom } from './Border'
import { CollapsableProps, CollapseArrow } from './Collapsable'
import { Icon } from './Icon'
import { Sizes, Space } from './Space'
import { SubTitle } from './text/SubTitle'
import { Title } from './text/Title'
import { Omit } from './types'
import { Col } from './View/Col'
import { Row, RowProps } from './View/Row'
import { View } from './View/View'

export type TitleRowSpecificProps = Partial<CollapsableProps> & {
  size?: Sizes
  icon?: React.ReactNode
  title: React.ReactNode
  before?: React.ReactNode
  bordered?: boolean
  after?: React.ReactNode
  above?: React.ReactNode
  below?: React.ReactNode
  sizePadding?: number
  backgrounded?: boolean
  subTitle?: React.ReactNode
  margin?: number | number[]
  unpad?: boolean
}

export type TitleRowProps = Omit<RowProps, 'size'> & TitleRowSpecificProps

type x = RowProps['size']

export const TitleRow = forwardRef(function TitleRow(
  {
    before,
    bordered,
    after,
    size = 'md',
    sizePadding = 1,
    subTitle,
    backgrounded,
    below,
    above,
    icon,
    title,
    collapsable,
    collapsed,
    onCollapse,
    ...rowProps
  }: TitleRowProps,
  ref,
) {
  return (
    <TitleRowChrome
      background={backgrounded ? theme => theme.backgroundZebra : null}
      onDoubleClick={onCollapse && (() => onCollapse(!collapsed))}
      ref={ref}
      {...rowProps}
    >
      {above}
      <Row>
        {collapsable && <CollapseArrow collapsed={collapsed} />}
        {before && (
          <>
            {before}
            <Space />
          </>
        )}
        {typeof icon === 'string' ? (
          <>
            <Icon alignSelf="center" name={icon} size={20} />
            <Space />
          </>
        ) : (
          icon || null
        )}
        <View flex={1}>
          {isValidElement(title) ? (
            title
          ) : (
            <Title size={size} marginTop={0} marginBottom={0} ellipse>
              {title}
            </Title>
          )}
          {!!subTitle && (
            <>
              <SubTitle ellipse marginBottom={0}>
                {subTitle}
              </SubTitle>
            </>
          )}
        </View>
        {after}
      </Row>
      {below}
      {bordered && <BorderBottom left={10 * sizePadding} right={10 * sizePadding} opacity={0.5} />}
    </TitleRowChrome>
  )
})

const TitleRowChrome = gloss(Col, {
  position: 'relative',
  overflow: 'hidden',
})

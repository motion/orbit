import { gloss } from '@o/gloss'
import React, { forwardRef, isValidElement } from 'react'

import { BorderBottom } from './Border'
import { CollapsableProps, CollapseArrow, splitCollapseProps } from './Collapsable'
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
  title?: React.ReactNode
  before?: React.ReactNode
  bordered?: boolean
  borderSize?: number
  after?: React.ReactNode
  above?: React.ReactNode
  below?: React.ReactNode
  sizePadding?: number
  backgrounded?: boolean
  subTitle?: React.ReactNode
  margin?: number | number[]
  unpad?: boolean
  children?: React.ReactNode
}

export type TitleRowProps = Omit<RowProps, 'size'> & TitleRowSpecificProps

export const TitleRow = forwardRef(
  (
    {
      before,
      borderSize = 1,
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
      children,
      ...allProps
    }: TitleRowProps,
    ref,
  ) => {
    const [collapseProps, rowProps] = splitCollapseProps(allProps)
    const { collapsable, onCollapse, collapsed } = collapseProps
    const titleElement =
      !!title &&
      (isValidElement(title) ? (
        title
      ) : (
        <Title size={size} selectable ellipse>
          {title}
        </Title>
      ))

    return (
      <TitleRowChrome
        background={backgrounded ? theme => theme.backgroundZebra : null}
        onDoubleClick={onCollapse && (() => onCollapse(!collapsed))}
        ref={ref}
        {...rowProps}
      >
        {above}
        <Row alignItems="center">
          {collapsable && <CollapseArrow {...collapseProps} />}
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
          <View flex={1} alignItems="flex-start">
            {titleElement}
            {children}
            {!!subTitle && (
              <>
                <SubTitle selectable ellipse marginBottom={0}>
                  {subTitle}
                </SubTitle>
              </>
            )}
          </View>
          {after}
        </Row>
        {below}
        {bordered && (
          <BorderBottom height={borderSize} left={10 * sizePadding} right={10 * sizePadding} />
        )}
      </TitleRowChrome>
    )
  },
)

const TitleRowChrome = gloss(Col, {
  position: 'relative',
  overflow: 'hidden',
})

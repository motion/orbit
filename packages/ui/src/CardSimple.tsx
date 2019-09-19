import { isDefined } from '@o/utils'
import React from 'react'

import { SizedSurface, SizedSurfaceSpecificProps } from './SizedSurface'
import { Tag, TagProps } from './Tag'
import { SimpleText } from './text/SimpleText'
import { Col, ColProps } from './View/Col'

export type CardSimpleProps = SizedSurfaceSpecificProps &
  Omit<ColProps, 'size'> & {
    title?: React.ReactNode
    titleProps?: TagProps
    onClickTitle?: (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => void
  }

export const CardSimple = ({
  title,
  titleProps,
  onClickTitle,
  children,
  space,
  group,
  padding,
  scrollable,
  ...props
}: CardSimpleProps) => {
  const hasClick = !!props.onClick
  return (
    <SizedSurface
      className="ui-cardsimple-surface"
      borderWidth={0}
      overflow={isDefined(scrollable, props.maxHeight) ? 'hidden' : 'hidden'}
      hoverStyle={hasClick}
      activeStyle={hasClick}
      cursor={hasClick ? 'pointer' : 'inherit'}
      themeSubSelect="cardSimple"
      {...props}
      noInnerElement
    >
      <Col padding={padding} space={space} group={group} scrollable={scrollable}>
        {!!title && (
          <Tag coat="lightGray" onClick={onClickTitle} {...titleProps}>
            {title}
          </Tag>
        )}
        <SimpleText size={0.85} alpha={0.85}>
          {children}
        </SimpleText>
      </Col>
    </SizedSurface>
  )
}

CardSimple.defaultProps = {
  sizeRadius: true,
}

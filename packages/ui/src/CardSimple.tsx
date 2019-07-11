import { isDefined } from '@o/utils'
import React, { forwardRef } from 'react'

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

export const CardSimple = forwardRef(
  (
    {
      title,
      titleProps,
      onClickTitle,
      children,
      space,
      group,
      padding,
      scrollable,
      ...props
    }: CardSimpleProps,
    ref,
  ) => {
    const hasClick = !!props.onClick
    return (
      <SizedSurface
        ref={ref}
        className="ui-cardsimple-surface"
        borderWidth={0}
        overflow={isDefined(scrollable, props.maxHeight) ? 'hidden' : 'hidden'}
        hoverStyle={hasClick}
        activeStyle={hasClick}
        cursor={hasClick ? 'pointer' : 'inherit'}
        subTheme="cardSimple"
        {...props}
        noInnerElement
      >
        <Col padding={padding} space={space} group={group} scrollable={scrollable}>
          {!!title && (
            <Tag alt="lightGray" onClick={onClickTitle} {...titleProps}>
              {title}
            </Tag>
          )}
          <SimpleText size={0.85} alpha={0.85}>
            {children}
          </SimpleText>
        </Col>
      </SizedSurface>
    )
  },
)

CardSimple.defaultProps = {
  sizeRadius: true,
}

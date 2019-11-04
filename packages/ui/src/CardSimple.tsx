import { isDefined } from '@o/utils'
import React from 'react'

import { Surface, SurfaceSpecificProps } from './Surface'
import { Tag, TagProps } from './Tag'
import { SimpleText } from './text/SimpleText'
import { Stack, StackProps } from './View/Stack'

export type CardSimpleProps = SurfaceSpecificProps &
  Omit<StackProps, 'size'> & {
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
  const hasClick = !!props.onClick ? undefined : null
  return (
    <Surface
      className="ui-cardsimple-surface"
      borderWidth={0}
      overflow={isDefined(scrollable, props.maxHeight) ? 'hidden' : 'hidden'}
      hoverStyle={hasClick}
      activeStyle={hasClick}
      cursor={hasClick ? 'pointer' : 'inherit'}
      subTheme="cardSimple"
      {...props}
      showInnerElement="never"
    >
      <Stack padding={padding} space={space} group={group} scrollable={scrollable}>
        {!!title && (
          <Tag coat="lightGray" onClick={onClickTitle} {...titleProps}>
            {title}
          </Tag>
        )}
        <SimpleText size={0.85} alpha={0.85}>
          {children}
        </SimpleText>
      </Stack>
    </Surface>
  )
}

CardSimple.defaultProps = {
  sizeRadius: true,
}

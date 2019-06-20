import { selectDefined } from '@o/utils'
import { gloss } from 'gloss'
import React, { forwardRef, isValidElement } from 'react'

import { BorderBottom } from './Border'
import { CollapsableProps, CollapseArrow, splitCollapseProps, useCollapse } from './Collapsable'
import { themeable, ThemeableProps } from './helpers/themeable'
import { Icon } from './Icon'
import { useScale } from './Scale'
import { getSpaceSize, Size } from './Space'
import { SubTitle } from './text/SubTitle'
import { Title, TitleProps } from './text/Title'
import { Omit } from './types'
import { Col } from './View/Col'
import { Row, RowProps } from './View/Row'

export type TitleRowSpecificProps = ThemeableProps &
  Partial<CollapsableProps> & {
    /** Size the title and subtitle */
    size?: Size

    /** Add an icon before title */
    icon?: React.ReactNode

    /** Set the title text */
    title?: React.ReactNode

    /** Additional props for styling the title */
    titleProps?: Partial<TitleProps>

    /** Add an element before title */
    before?: React.ReactNode

    /** Add a border below the title */
    bordered?: boolean

    /** Set the thickness of the title border, used with bordered */
    borderSize?: number

    /** Add an element after title */
    after?: React.ReactNode

    /** Add an element above title */
    above?: React.ReactNode

    /** Add an element below title */
    below?: React.ReactNode

    /** Adds a subtle background behind the title */
    backgrounded?: boolean

    /** Set the subtitle text */
    subTitle?: React.ReactNode

    /** Add a margine to title */
    margin?: number | number[]

    /** Automatically set negative margin equivalent to Size */
    unpad?: boolean

    /** Add an extra line of elements below the title */
    children?: React.ReactNode

    /** Allow text selection for everything inside */
    selectable?: boolean
  }

export type TitleRowProps = Omit<RowProps, 'size' | 'children'> & TitleRowSpecificProps

export const TitleRow = themeable(
  forwardRef(
    (
      {
        before,
        borderSize = 1,
        bordered,
        after,
        size = 'md',
        subTitle,
        backgrounded,
        below,
        above,
        icon,
        title,
        children,
        titleProps,
        space,
        selectable,
        ...allProps
      }: TitleRowProps,
      ref,
    ) => {
      const scale = useScale()
      const iconSize = 32 * scale
      const spaceSize = getSpaceSize(selectDefined(space, size))
      const [collapseProps, rowProps] = splitCollapseProps(allProps)
      const collapse = useCollapse(collapseProps)
      const titleElement =
        !!title &&
        (isValidElement(title) ? (
          title
        ) : (
          <Title size={size} selectable={selectable} ellipse {...titleProps}>
            {title}
          </Title>
        ))

      return (
        <TitleRowChrome
          onDoubleClick={(collapse.isCollapsable && collapse.toggle) || undefined}
          background={backgrounded ? titleRowBg : null}
          ref={ref}
          space={space}
          {...rowProps}
        >
          {above}
          <Row alignItems="center" space={size}>
            {collapse.isCollapsable && <CollapseArrow useCollapse={collapse} />}
            {before}
            {typeof icon === 'string' ? (
              <Icon alignSelf="center" name={icon} size={iconSize} />
            ) : React.isValidElement(icon) ? (
              React.cloneElement(icon as any, { size: iconSize })
            ) : (
              icon || null
            )}
            <Col space={spaceSize} flex={1} alignItems="flex-start">
              {titleElement}
              {!!subTitle && (
                <SubTitle selectable={selectable} ellipse marginBottom={0}>
                  {subTitle}
                </SubTitle>
              )}
              {children}
            </Col>
            <Row alignItems="center" space>
              {after}
            </Row>
          </Row>
          {below}
          {bordered && <BorderBottom height={borderSize} />}
        </TitleRowChrome>
      )
    },
  ),
)

const titleRowBg = theme => theme.backgroundStrong

const TitleRowChrome = gloss(Col, {
  position: 'relative',
  overflow: 'hidden',
})

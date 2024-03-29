import { selectDefined } from '@o/utils'
import { gloss } from 'gloss'
import React, { isValidElement } from 'react'

import { BorderBottom } from './Border'
import { CollapsableProps, CollapseArrow, splitCollapseProps, useCollapse } from './Collapsable'
import { themeable, ThemeableProps } from './helpers/themeable'
import { Icon } from './Icon'
import { useScale } from './Scale'
import { getSpaceSize, Size } from './Space'
import { SubTitle } from './text/SubTitle'
import { Title, TitleProps } from './text/Title'
import { Stack, StackProps } from './View/Stack'

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

    /** Add an extra line of elements below the title */
    children?: React.ReactNode

    /** Allow text selection for everything inside */
    selectable?: boolean
  }

export type TitleRowProps = Omit<StackProps, 'size' | 'children'> & TitleRowSpecificProps

export const TitleRow = themeable((props: TitleRowProps) => {
  const {
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
  } = props
  const spaceSize = getSpaceSize(selectDefined(space, size))
  const scale = useScale()
  const iconSize = 32 * scale
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
      space={space}
      {...rowProps}
    >
      {above}
      <Stack direction="horizontal" alignItems="center" space={size}>
        {collapse.isCollapsable && <CollapseArrow useCollapse={collapse} />}
        {before}
        {typeof icon === 'string' ? (
          <Icon alignSelf="center" name={icon} size={iconSize} />
        ) : React.isValidElement(icon) ? (
          React.cloneElement(icon as any, { size: iconSize })
        ) : (
          icon || null
        )}
        <Stack space={spaceSize} flex={1} alignItems="flex-start">
          {titleElement}
          {!!subTitle && (
            <SubTitle selectable={selectable} ellipse marginBottom={0}>
              {subTitle}
            </SubTitle>
          )}
          {children}
        </Stack>
        <Stack direction="horizontal" alignItems="center" space>
          {after}
        </Stack>
      </Stack>
      {below}
      {bordered && <BorderBottom height={borderSize} />}
    </TitleRowChrome>
  )
})

const titleRowBg = theme => theme.backgroundStrong

const TitleRowChrome = gloss(Stack, {
  position: 'relative',
  overflow: 'hidden',
})

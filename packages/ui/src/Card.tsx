import { isDefined, selectDefined } from '@o/utils'
import { Theme, ThemeResetSubTheme } from 'gloss'
import React, { useCallback } from 'react'

import { CollapsableProps, CollapseArrow, splitCollapseProps, useCollapse } from './Collapsable'
import { ListItemSimple } from './lists/ListItemSimple'
import { ListItemProps, ListItemSpecificProps } from './lists/ListItemViewProps'
import { useIsSelected } from './lists/useIsSelected'
import { getSize } from './Sizes'
import { getSpaceSizeNum, Sizes } from './Space'
import { Surface, SurfaceSpecificProps } from './Surface'
import { Stack, StackProps } from './View/Stack'

export type CardProps = SurfaceSpecificProps &
  ListItemSpecificProps &
  Partial<CollapsableProps> &
  Omit<StackProps, 'size'> & {
    collapseOnClick?: boolean
    onClickTitle?: Function
    headerProps?: ListItemProps
    titlePadding?: Sizes
    innerColProps?: StackProps
    themeImmer?: string
  }

export function Card(props: CardProps) {
  const [collapseProps, rest] = splitCollapseProps(props)
  const {
    padding,
    sizeRadius = true,
    icon,
    location,
    preview,
    title,
    afterTitle,
    children,
    iconProps,
    titleProps,
    subTitleProps,
    titleFlex,
    onClickLocation,
    subTitle,
    date,
    hideSubtitle,
    space,
    flexDirection,
    collapseOnClick,
    scrollable,
    maxHeight,
    size,
    iconBefore,
    headerProps,
    coat,
    onClickTitle,
    titlePadding,
    themeInner,
    innerColProps,
    ...sizedSurfaceProps
  } = rest
  const isSelected = useIsSelected(props)
  const showChildren = typeof children !== 'undefined' && !props.hideBody
  const toggle = useCollapse(collapseProps)
  const hasTitleClick = !!(collapseOnClick || onClickTitle || (headerProps && headerProps.onClick))
  const hasTitle = selectDefined(title, afterTitle, subTitle, icon, date, location)

  let innerContent = (
    <Stack
      className="ui-card-inner"
      scrollable={scrollable}
      flexDirection={flexDirection}
      space={!!space && getSpaceSizeNum(space) * getSize(size)}
      padding={padding}
      flex={1}
      // using this caused a bug with animations inside, they would not position properly
      // specifically the OrbitAppsDrawer would show apps not aligned, not setting hidden fixed it
      // overflow="hidden"
      // but.... if you dont use flex + overflow hidden, scrollables inside wont work...
      overflow="hidden"
      maxHeight={maxHeight}
      useCollapse={toggle}
      // this fixed a super super chrome bug where doing any transform/animation
      // caused this inner node to not size as it should, this fixes it!
      transform="translate3d(0, 0, 0)"
      suspense
      background={backgroundTheme}
      {...innerColProps}
    >
      {showChildren && children}
    </Stack>
  )

  if (themeInner) {
    innerContent = <Theme name={themeInner}>{innerContent}</Theme>
  } else {
    // reset inner contents to be original theme
    innerContent = <ThemeResetSubTheme>{innerContent}</ThemeResetSubTheme>
  }

  return (
    <Surface
      data-is="Card"
      borderWidth={1}
      overflow={isDefined(scrollable, maxHeight) ? 'hidden' : 'hidden'}
      flex={
        toggle.isCollapsable === true && toggle.val === true ? 'inherit' : sizedSurfaceProps.flex
      }
      subTheme="card"
      coat={isSelected ? 'selected' : coat}
      sizeRadius={sizeRadius}
      noInnerElement
      size={size}
      hoverStyle={false}
      activeStyle={false}
      {...sizedSurfaceProps}
    >
      {hasTitle && (
        <ListItemSimple
          before={(toggle.isCollapsable && <CollapseArrow useCollapse={toggle} />) || undefined}
          className="ui-card-header grid-draggable"
          onClickLocation={onClickLocation}
          onDoubleClick={
            (!collapseOnClick && collapseProps.collapsable && toggle.toggle) || undefined
          }
          onClick={useCallback(
            e => {
              collapseOnClick && toggle.toggle()
              onClickTitle && onClickTitle(e)
            },
            [collapseOnClick, onClickTitle],
          )}
          cursor={hasTitleClick ? 'pointer' : 'inherit'}
          alignItems="center"
          titleFlex={titleFlex}
          subTitleProps={subTitleProps}
          titleProps={{
            fontWeight: 400,
            ...titleProps,
          }}
          hoverStyle={hasTitleClick ? true : false}
          activeStyle={hasTitleClick ? true : false}
          afterTitle={afterTitle}
          title={title}
          subTitle={subTitle}
          date={date}
          icon={icon}
          location={location}
          hideSubtitle={hideSubtitle}
          iconProps={iconProps}
          preview={preview}
          iconBefore={iconBefore}
          padding={selectDefined(titlePadding, 'sm')}
          {...headerProps}
        />
      )}
      {innerContent}
    </Surface>
  )
}

const backgroundTheme = theme => theme.background

// @ts-ignore
Card.accepts = {
  surfaceProps: true,
}

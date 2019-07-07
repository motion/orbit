import { isDefined, selectDefined } from '@o/utils'
import { Theme, useThemeContext } from 'gloss'
import React, { forwardRef, useCallback } from 'react'

import { CollapsableProps, CollapseArrow, splitCollapseProps, useCollapse } from './Collapsable'
import { ListItemProps } from './lists/ListItem'
import { ListItemSimple, ListItemSpecificProps, useIsSelected } from './lists/ListItemSimple'
import { SizedSurface, SizedSurfaceSpecificProps } from './SizedSurface'
import { getSize } from './Sizes'
import { getSpaceSizeNum, Sizes } from './Space'
import { Col, ColProps } from './View/Col'

export type CardProps = SizedSurfaceSpecificProps &
  ListItemSpecificProps &
  Partial<CollapsableProps> &
  Omit<ColProps, 'size'> & {
    collapseOnClick?: boolean
    onClickTitle?: Function
    headerProps?: ListItemProps
    titlePadding?: Sizes
  }

export const Card = forwardRef(function Card(props: CardProps, ref) {
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
    alt,
    onClickTitle,
    titlePadding,
    ...sizedSurfaceProps
  } = rest
  // end
  const { activeThemeName } = useThemeContext()
  const isSelected = useIsSelected(props)
  const showChildren = typeof children !== 'undefined' && !props.hideBody
  const toggle = useCollapse(collapseProps)
  const hasTitleClick = !!(collapseOnClick || onClickTitle || (headerProps && headerProps.onClick))
  const hasTitle = selectDefined(title, afterTitle, subTitle, icon, date, location)
  return (
    <Theme alt={isSelected ? 'selected' : alt || null}>
      <SizedSurface
        forwardRef={ref}
        className="ui-card-surface"
        borderWidth={1}
        overflow={isDefined(scrollable, maxHeight) ? 'hidden' : 'hidden'}
        flex={
          toggle.isCollapsable === true && toggle.val === true ? 'inherit' : sizedSurfaceProps.flex
        }
        themeSelect="card"
        sizeRadius={sizeRadius}
        noInnerElement
        size={size}
        hoverStyle={null}
        activeStyle={null}
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
            cursor={hasTitleClick ? 'pointer' : 'auto'}
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
        {/* reset inner contents to be original theme */}
        <Theme name={activeThemeName}>
          <Col
            className="ui-card-inner"
            scrollable={scrollable}
            flexDirection={flexDirection}
            space={!!space && getSpaceSizeNum(space) * getSize(size)}
            padding={padding}
            flex={1}
            maxHeight={maxHeight}
            // using this caused a bug with animations inside, they would not position properly
            // specifically the OrbitAppsDrawer would show apps not aligned, not setting hidden fixed it
            // overflow="hidden"
            useCollapse={toggle}
            // this fixed a super super chrome bug where doing any transform/animation
            // caused this inner node to not size as it should, this fixes it!
            transform="translate3d(0, 0, 0)"
          // {...resetColors}
          >
            {showChildren && children}
          </Col>
        </Theme>
      </SizedSurface>
    </Theme>
  )
})

// @ts-ignore
Card.accepts = {
  surfaceProps: true,
}

// const resetColors: any = {
//   background: theme => theme.background,
//   color: theme => theme.color,
// }

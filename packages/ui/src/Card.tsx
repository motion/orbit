import { Theme, useThemeContext } from '@o/gloss'
import { isDefined, selectDefined } from '@o/utils'
import React, { useCallback } from 'react'

import { Collapsable, CollapsableProps, CollapseArrow, splitCollapseProps, useCollapse } from './Collapsable'
import { ListItemProps } from './lists/ListItem'
import { ListItemSimple, ListItemSpecificProps, useIsSelected } from './lists/ListItemSimple'
import { Scale } from './Scale'
import { SizedSurface, SizedSurfaceSpecificProps } from './SizedSurface'
import { getSize } from './Sizes'
import { getSpaceSize, Sizes } from './Space'
import { Omit } from './types'
import { Col, ColProps } from './View/Col'

export type CardProps = SizedSurfaceSpecificProps &
  ListItemSpecificProps &
  Partial<CollapsableProps> &
  Omit<ColProps, 'size'> & {
    space?: Sizes
    collapseOnClick?: boolean
    onClickTitle?: Function
    headerProps?: ListItemProps
    titlePad?: Sizes
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
    pad,
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
    titlePad,
    ...sizedSurfaceProps
  } = rest
  // end
  const { activeThemeName } = useThemeContext()
  const isSelected = useIsSelected(props)
  const showChildren = typeof children !== 'undefined' && !props.hideBody
  const toggle = useCollapse(collapseProps)
  const padProps = {
    pad,
    padding,
  }
  const hasTitleClick = !!(collapseOnClick || onClickTitle || (headerProps && headerProps.onClick))
  return (
    <Theme alt={isSelected ? 'selected' : alt || null}>
      <Scale size={getSize(size)}>
        <SizedSurface
          className="ui-card-surface"
          borderWidth={1}
          overflow={isDefined(scrollable, maxHeight) ? 'hidden' : 'hidden'}
          {...sizedSurfaceProps}
          flex={
            toggle.isCollapsable === true && toggle.val === true
              ? 'inherit'
              : sizedSurfaceProps.flex
          }
          themeSelect="card"
          sizeRadius={sizeRadius}
          noInnerElement
          size={size}
          hoverStyle={null}
          activeStyle={null}
        >
          {/* Cards are ListItems scaled up 1.1 */}
          <Scale size={1.1}>
            <ListItemSimple
              before={<CollapseArrow useCollapse={toggle} />}
              className="grid-draggable"
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
                fontWeight: 600,
                ...titleProps,
              }}
              hoverStyle={hasTitleClick ? true : false}
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
              pad={selectDefined(titlePad, 'sm')}
              {...headerProps}
            />
          </Scale>
          {/* reset inner contents to be original theme */}
          <Theme name={activeThemeName}>
            <Collapsable useCollapse={toggle}>
              <Col
                scrollable={scrollable}
                flexDirection={flexDirection}
                space={!!space && getSpaceSize(space) * getSize(size)}
                pad={pad}
                padding={padding}
                flex={1}
                maxHeight={maxHeight}
                {...resetColors}
                {...padProps}
              >
                {showChildren && children}
              </Col>
            </Collapsable>
          </Theme>
        </SizedSurface>
      </Scale>
    </Theme>
  )
}

Card.accepts = {
  surfaceProps: true,
}

const resetColors: any = {
  background: theme => theme.background,
  color: theme => theme.color,
}

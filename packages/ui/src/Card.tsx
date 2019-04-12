import { Theme, useThemeContext } from '@o/gloss'
import { isDefined } from '@o/utils'
import React from 'react'
import {
  Collapsable,
  CollapsableProps,
  CollapseArrow,
  splitCollapseProps,
  useCollapseToggle,
} from './Collapsable'
import { ListItem, ListItemSpecificProps, useIsSelected } from './lists/ListItem'
import { Scale } from './Scale'
import { getSize, SizedSurface, SizedSurfaceSpecificProps } from './SizedSurface'
import { getSpaceSize, Sizes } from './Space'
import { Col, ColProps } from './View/Col'

export type CardProps = SizedSurfaceSpecificProps &
  ListItemSpecificProps &
  Partial<CollapsableProps> &
  ColProps & {
    space?: Sizes
    collapseOnClick?: boolean
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
    alt,
    ...sizedSurfaceProps
  } = rest
  // end
  const { activeThemeName } = useThemeContext()
  const isSelected = useIsSelected(props)
  const showChildren = typeof children !== 'undefined' && !props.hideBody
  const toggle = useCollapseToggle(collapseProps)
  const padProps = {
    pad,
    padding,
  }
  return (
    <Theme alternate={isSelected ? 'selected' : alt || null}>
      <Scale size={getSize(size)}>
        <SizedSurface
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
            <ListItem
              before={<CollapseArrow useToggle={toggle} />}
              className="grid-draggable"
              onClickLocation={onClickLocation}
              onDoubleClick={
                (!collapseOnClick && collapseProps.collapsable && toggle.toggle) || undefined
              }
              onClick={collapseOnClick && toggle.toggle}
              alignItems="center"
              titleFlex={titleFlex}
              subTitleProps={subTitleProps}
              padding={0}
              titleProps={{
                fontWeight: 500,
                ...titleProps,
              }}
              hoverStyle={null}
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
              {...padProps}
            />
          </Scale>
          <Collapsable useToggle={toggle}>
            {/* reset inner contents to be original theme */}
            <Theme name={activeThemeName}>
              <Col
                scrollable={scrollable}
                flexDirection={flexDirection}
                space={getSpaceSize(space) * getSize(size)}
                pad={pad}
                padding={padding}
                flex={1}
                maxHeight={maxHeight}
                {...resetColors}
                {...padProps}
              >
                {showChildren && children}
              </Col>
            </Theme>
          </Collapsable>
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

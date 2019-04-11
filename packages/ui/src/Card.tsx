import { Theme, useTheme } from '@o/gloss'
import { isDefined } from '@o/utils'
import React from 'react'
import {
  Collapsable,
  CollapsableProps,
  CollapseArrow,
  splitCollapseProps,
  useCollapseToggle,
} from './Collapsable'
import { ListItem, ListItemProps, useIsSelected } from './lists/ListItem'
import { Scale } from './Scale'
import { getSize, SizedSurface, SizedSurfaceProps } from './SizedSurface'
import { getSpaceSize, Sizes } from './Space'
import { Col, ColProps } from './View/Col'

export type CardProps = SizedSurfaceProps &
  ListItemProps &
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
    ...sizedSurfaceProps
  } = rest
  // end
  const theme = useTheme()
  const isSelected = useIsSelected(props)
  const showChildren = typeof children !== 'undefined' && !props.hideBody
  const toggle = useCollapseToggle(collapseProps)
  const padProps = {
    pad,
    padding,
  }
  return (
    <Theme alternate={isSelected ? 'selected' : props.alt || null}>
      <Scale size={getSize(size)}>
        <SizedSurface
          borderWidth={1}
          overflow={isDefined(scrollable, maxHeight) ? 'hidden' : 'hidden'}
          {...sizedSurfaceProps}
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
              before={<CollapseArrow useToggle={toggle} />}
              location={location}
              hideSubtitle={hideSubtitle}
              iconProps={iconProps}
              preview={preview}
              iconBefore={iconBefore}
              {...padProps}
            />
          </Scale>
          <Collapsable useToggle={toggle}>
            <Col
              scrollable={scrollable}
              flexDirection={flexDirection}
              space={getSpaceSize(space) * getSize(size)}
              pad={pad}
              padding={padding}
              flex={1}
              maxHeight={maxHeight}
              background={theme.background}
              {...padProps}
            >
              {showChildren && children}
            </Col>
          </Collapsable>
        </SizedSurface>
      </Scale>
    </Theme>
  )
}

Card.accepts = {
  surfaceProps: true,
}

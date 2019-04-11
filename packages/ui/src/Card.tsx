import { Theme } from '@o/gloss'
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
import { SizedSurface, SizedSurfaceProps } from './SizedSurface'
import { Sizes, Space } from './Space'
import { Col, ColProps } from './View/Col'
import { getBetweenPad } from './View/View'

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
    ...sizedSurfaceProps
  } = rest
  // end
  const isSelected = useIsSelected(props)
  const showChildren = typeof children !== 'undefined' && !props.hideBody
  const toggle = useCollapseToggle(collapseProps)
  return (
    <Theme alternate={isSelected ? 'selected' : null}>
      <SizedSurface
        borderWidth={1}
        {...sizedSurfaceProps}
        themeSelect="card"
        sizeRadius={sizeRadius}
        noInnerElement
        pad={pad}
        padding={padding}
        overflow={isDefined(scrollable, maxHeight) ? 'hidden' : undefined}
      >
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
          />
        </Scale>
        <Collapsable useToggle={toggle}>
          <Space size={typeof padding === 'number' ? padding : getBetweenPad(pad)} />
          <Col
            scrollable={scrollable}
            flexDirection={flexDirection}
            space={space}
            pad={pad}
            padding={padding}
            flex={1}
            maxHeight={maxHeight}
          >
            {showChildren && children}
          </Col>
        </Collapsable>
      </SizedSurface>
    </Theme>
  )
}

Card.accepts = {
  surfaceProps: true,
}

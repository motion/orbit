import { Theme } from '@o/gloss'
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
import { Col } from './View/Col'
import { getBetweenPad } from './View/View'

export type CardProps = SizedSurfaceProps &
  ListItemProps &
  Partial<CollapsableProps> & {
    space?: Sizes
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
      >
        <Scale size={1.1}>
          <ListItem
            className="grid-draggable"
            onClickLocation={onClickLocation}
            onDoubleClick={collapseProps.collapsable && toggle.toggle}
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
          <Col flexDirection={flexDirection} space={space} pad={pad} padding={padding} flex={1}>
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

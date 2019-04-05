import { Theme } from '@o/gloss'
import * as React from 'react'
import { Collapsable, CollapsableProps } from './Collapsable'
import { ListItem, ListItemProps, useIsSelected } from './lists/ListItem'
import { Scale } from './Scale'
import { SizedSurface, SizedSurfaceProps } from './SizedSurface'
import { Space } from './Space'
import { Col } from './View/Col'

export type CardProps = SizedSurfaceProps & ListItemProps & Partial<CollapsableProps>

export function Card(props: CardProps) {
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
    padded,
    date,
    collapsable,
    collapsed,
    onCollapse,
    hideSubtitle,
    spacing,
    flexDirection,
    ...restProps
  } = props
  const isSelected = useIsSelected(props)
  const showChildren = typeof children !== 'undefined' && !props.hideBody
  return (
    <Theme alternate={isSelected ? 'selected' : null}>
      <SizedSurface
        borderWidth={1}
        {...restProps}
        themeSelect="card"
        sizeRadius={sizeRadius}
        noInnerElement
        padded={padded}
      >
        <Scale size={1.1}>
          <ListItem
            className="grid-draggable"
            backgroundHover="transparent"
            onClickLocation={onClickLocation}
            alignItems="center"
            titleFlex={titleFlex}
            subTitleProps={subTitleProps}
            padding={0}
            titleProps={{
              fontWeight: 500,
              ...titleProps,
            }}
            afterTitle={afterTitle}
            title={title}
            subTitle={subTitle}
            date={date}
            icon={icon}
            location={location}
            hideSubtitle={hideSubtitle}
            iconProps={iconProps}
            preview={preview}
          />
        </Scale>
        <Space spacing={padded} />
        <Collapsable collapsable={collapsable} onCollapse={onCollapse}>
          <Col
            flexDirection={flexDirection}
            spacing={spacing}
            padded={padded}
            flex={1}
            height={collapsed ? 0 : '100%'}
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

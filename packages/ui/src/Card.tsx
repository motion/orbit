import { Theme } from '@o/gloss'
import * as React from 'react'
import { Collapsable, CollapsableProps } from './Collapsable'
import { Padded, PaddedProps } from './layout/Padded'
import { ListItem, ListItemProps, useIsSelected } from './lists/ListItem'
import { Scale } from './Scale'
import { SizedSurface, SizedSurfaceProps } from './SizedSurface'
import { View } from './View/View'

export type CardProps = PaddedProps & SizedSurfaceProps & ListItemProps & Partial<CollapsableProps>

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
        padding={padding}
      >
        <Scale size={1.1}>
          <ListItem
            className="grid-draggable"
            backgroundHover="transparent"
            onClickLocation={onClickLocation}
            titleFlex={titleFlex}
            subTitleProps={subTitleProps}
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
        <Collapsable collapsable={collapsable} onCollapse={onCollapse}>
          <Padded padded={padded}>
            <View flex={1} height={collapsed ? 0 : '100%'}>
              {showChildren && children}
            </View>
          </Padded>
        </Collapsable>
      </SizedSurface>
    </Theme>
  )
}

import { gloss, Theme, ThemeContext } from '@o/gloss'
import { useReaction } from '@o/use-store'
import { differenceInCalendarDays } from 'date-fns'
import React from 'react'
import { BorderBottom } from '../Border'
import { RoundButtonSmall } from '../buttons/RoundButtonSmall'
import { memoIsEqualDeep } from '../helpers/memoHelpers'
import { Icon, IconProps } from '../Icon'
import { Separator } from '../Separator'
import { SizedSurface, SizedSurfaceProps } from '../SizedSurface'
import { Space } from '../Space'
import { DateFormat } from '../text/DateFormat'
import { HighlightText } from '../text/HighlightText'
import { SimpleText } from '../text/SimpleText'
import { Text } from '../text/Text'
import { Row } from '../View/Row'
import { View } from '../View/View'

export type ItemRenderText = (text: string) => JSX.Element
export type HandleSelection = (index: number, event?: any) => any

export type ListItemHide = {
  hideTitle?: boolean
  hideIcon?: boolean
  hideSubtitle?: boolean
  hideBody?: boolean
  hideItemDate?: boolean
  hideDate?: boolean
  hideMeta?: boolean
}

export type ListItemDisplayProps = {
  oneLine?: boolean
  condensed?: boolean
}

export type ListItemProps = SizedSurfaceProps &
  ListItemHide &
  ListItemDisplayProps & {
    indent?: number
    forwardRef?: any
    subId?: string | number
    location?: React.ReactNode
    preview?: React.ReactNode
    title?: React.ReactNode
    subTextOpacity?: number
    small?: boolean
    above?: React.ReactNode
    activeStyle?: Record<string, any>
    before?: React.ReactNode
    chromeless?: boolean
    listItem?: boolean
    subTitle?: React.ReactNode
    date?: Date
    icon?: any
    index?: number
    isExpanded?: boolean
    style?: any
    afterTitle?: React.ReactNode
    after?: React.ReactNode
    titleProps?: Record<string, any>
    iconBefore?: boolean
    iconProps?: Partial<IconProps>
    separatorProps?: Record<string, any>
    className?: string
    pane?: string
    subPane?: string
    renderText?: ItemRenderText
    children?: React.ReactNode
    onClick?: Function
    // its helpful to have a separate disableSelect for various JS-object/intuitiveness reasons
    disableSelect?: boolean
    // single click / keyboard select
    onSelect?: HandleSelection
    // double click / keyboard enter
    onOpen?: HandleSelection
    borderRadius?: number
    nextUpStyle?: Record<string, any>
    isSelected?: boolean | ((index: number) => boolean)
    padding?: number | number[]
    titleFlex?: number
    subTitleProps?: Record<string, any>
    getIndex?: (id: number) => number
    searchTerm?: string
    onClickLocation?: (index: number, e?: Event) => any
    separator?: React.ReactNode
    group?: string
  }

export const ListItem = memoIsEqualDeep(
  React.forwardRef(function ListItem(props: ListItemProps, ref) {
    const {
      date,
      location,
      preview,
      icon,
      subTitle,
      title,
      borderRadius,
      children,
      onClick,
      titleProps,
      subTitleProps,
      padding,
      onClickLocation,
      separator,
      oneLine,
      isExpanded,
      before,
      separatorProps,
      above,
      small,
      iconBefore: iconBeforeProp,
      subTextOpacity = 0.6,
      after,
      style,
      forwardRef,
      indent = 0,
      alignItems,
      ...rowProps
    } = props
    const isSelected = useIsSelected(props)
    const showChildren = !props.hideBody
    const showSubtitle = !!subTitle && !props.hideSubtitle
    const showDate = !!date && !props.hideDate
    const showIcon = !!icon && !props.hideIcon
    const showTitle = !!title && !props.hideTitle
    const showPreview = !!preview && !children && !props.hideBody
    const showPreviewInSubtitle = !showTitle && oneLine
    const sizeLineHeight = small ? 0.8 : 1
    const defaultPadding = small ? [7, 9] : [8, 10]
    const iconBefore = iconBeforeProp || !showTitle
    const hasMouseDownEvent = !!rowProps.onMouseDown

    // add a little vertical height for full height icons
    if (small && iconBefore) {
      defaultPadding[0] += 2
    }

    const iconElement = showIcon && getIcon(props)

    const childrenElement = showChildren && (
      <SimpleText size={0.9} alpha={subTextOpacity}>
        {children}
      </SimpleText>
    )
    const { activeThemeName } = React.useContext(ThemeContext)

    const afterHeaderElement = (
      <AfterHeader>
        <Row>
          {showDate && (
            <Text alpha={0.6} size={0.9} fontWeight={400}>
              <DateFormat date={date} nice={differenceInCalendarDays(Date.now(), date) < 7} />
            </Text>
          )}
        </Row>
      </AfterHeader>
    )

    const locationElement = !!location && (
      <>
        <RoundButtonSmall
          margin={[2, -1]}
          maxWidth={120}
          fontWeight={400}
          fontSize={13}
          alpha={subTextOpacity}
          onClick={onClickLocation || undefined}
          ellipse
        >
          {`${location}`}
        </RoundButtonSmall>
        <Space />
      </>
    )

    return (
      <Theme alternate={isSelected ? 'selected' : null}>
        {above}
        {!!separator && (
          <Theme name={activeThemeName}>
            <Separator paddingTop={props.index === 0 ? 8 : 16} {...separatorProps}>
              {separator}
            </Separator>
          </Theme>
        )}
        <SizedSurface
          noInnerElement
          flexFlow="row"
          alignItems="center"
          forwardRef={forwardRef || ref}
          themeSelect="listItem"
          borderRadius={borderRadius}
          onClick={(!hasMouseDownEvent && onClick) || undefined}
          padding={padding || defaultPadding}
          {...rowProps}
        >
          {before}
          {iconBefore && showIcon && iconElement}
          <ListItemMainContent oneLine={oneLine} style={{ paddingLeft: indent && indent * 8 }}>
            {showTitle && (
              <ListItemTitleBar alignItems={alignItems}>
                {showIcon && !iconBefore && iconElement}
                <HighlightText flex={1} ellipse fontWeight={400} {...titleProps}>
                  {title}
                </HighlightText>
                <Space />
                {props.afterTitle}
                {afterHeaderElement}
              </ListItemTitleBar>
            )}
            {showSubtitle && (
              <ListItemSubtitle>
                {showIcon && !showTitle && (
                  <>
                    {iconElement}
                    <Space />
                  </>
                )}
                {!!location && locationElement}
                {showPreviewInSubtitle ? (
                  <div style={{ flex: 1, overflow: 'hidden' }}>{childrenElement}</div>
                ) : null}
                {!!subTitle &&
                  (typeof subTitle === 'string' ? (
                    <HighlightText
                      alpha={subTextOpacity}
                      size={0.9}
                      sizeLineHeight={sizeLineHeight}
                      ellipse
                      {...subTitleProps}
                    >
                      {subTitle}
                    </HighlightText>
                  ) : (
                    subTitle
                  ))}
                {!subTitle && (
                  <>
                    <div style={{ flex: showPreviewInSubtitle ? 0 : 1 }} />
                  </>
                )}
                {!showTitle && (
                  <>
                    <Space />
                    {afterHeaderElement}
                  </>
                )}
              </ListItemSubtitle>
            )}
            {!showSubtitle && !showTitle && (
              <View
                position="absolute"
                right={Array.isArray(padding) ? padding[0] : padding}
                top={Array.isArray(padding) ? padding[1] : padding}
              >
                {afterHeaderElement}
              </View>
            )}
            {/* vertical space only if needed */}
            {showSubtitle && !!(children || showPreview) && (
              <div style={{ flex: 1, maxHeight: 4 }} />
            )}
            {showPreview && (
              <>
                {locationElement}
                <Preview>
                  {typeof preview !== 'string' && preview}
                  {typeof preview === 'string' && (
                    <HighlightText alpha={subTextOpacity} size={1} sizeLineHeight={0.9} ellipse={3}>
                      {preview}
                    </HighlightText>
                  )}
                </Preview>
              </>
            )}
            {!showPreviewInSubtitle && (
              <Row>
                {locationElement}
                {childrenElement}
              </Row>
            )}
          </ListItemMainContent>
          {after}
          <BorderBottom right={5} left={5} opacity={0.2} />
        </SizedSurface>
      </Theme>
    )
  }),
)

const ListItemTitleBar = gloss(View, {
  width: '100%',
  flex: 1,
  flexFlow: 'row',
  justifyContent: 'space-between',
  alignItems: 'flex-start',
})

const Preview = gloss({
  flex: 1,
  zIndex: -1,
})

const ListItemSubtitle = gloss(View, {
  flexFlow: 'row',
  alignItems: 'center',
  flex: 1,
  overflowX: 'hidden',
})

const AfterHeader = gloss({
  alignItems: 'flex-end',
  // why? for some reason this is really hard to align the text with the title,
  // check the visual date in list items to see if this helps align it in the row
  marginBottom: -4,
})

const ListItemMainContent = gloss({
  flex: 1,
  maxWidth: '100%',
  margin: ['auto', 0],
  oneLine: {
    flexFlow: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
  },
})

function getIcon({ icon, iconBefore, small, iconProps }: ListItemProps) {
  let iconSize = (iconProps && iconProps.size) || (iconBefore ? (small ? 20 : 28) : small ? 12 : 14)
  const iconPropsFinal = {
    size: iconSize,
    ...iconProps,
  }
  if (!iconBefore) {
    iconPropsFinal['style'] = { transform: `translateY(${small ? 4 : 3}px)` }
  }
  let element = icon
  if (React.isValidElement(icon)) {
    if (icon.type['acceptsIconProps']) {
      element = React.cloneElement(icon, iconPropsFinal)
    }
  } else {
    element = <Icon name={icon} {...iconPropsFinal} />
  }
  return (
    // use a view to ensure consistent width
    // and add the space
    <View width={iconSize + (small ? 8 : 10)}>{element}</View>
  )
}

export function useIsSelected(props: Pick<ListItemProps, 'isSelected' | 'index'>) {
  return useReaction(() => {
    if (typeof props.isSelected === 'function') {
      return props.isSelected(props.index)
    }
    return !!props.isSelected
  }, [props.isSelected])
}

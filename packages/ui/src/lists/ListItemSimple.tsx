import { isEqual } from '@o/fast-compare'
import { idFn, selectDefined } from '@o/utils'
import { differenceInCalendarDays } from 'date-fns'
import { Box, gloss, Theme, ThemeByName } from 'gloss'
import React, { isValidElement, memo, useCallback } from 'react'

import { BorderBottom } from '../Border'
import { Button } from '../buttons/Button'
import { RoundButtonSmall } from '../buttons/RoundButtonSmall'
import { useFocus } from '../Focus'
import { HighlightText } from '../Highlight'
import { Icon } from '../Icon'
import { ListSeparator } from '../ListSeparator'
import { Space } from '../Space'
import { Surface } from '../Surface'
import { DateFormat } from '../text/DateFormat'
import { SimpleText } from '../text/SimpleText'
import { Text } from '../text/Text'
import { usePadding } from '../View/PaddedView'
import { Stack } from '../View/Stack'
import { View } from '../View/View'
import { ListItemSimpleProps } from './ListItemViewProps'
import { useIsSelected } from './useIsSelected'

// this wrapper required for virtualization to measure/style */}
// prevents hard re-renders on resize by taking out the style prop
export function ListItemSimple({
  style,
  nodeRef,
  draggableItem,
  ...listProps
}: ListItemSimpleProps) {
  draggableItem
  return (
    <div style={style} ref={nodeRef}>
      <ListItemInner {...listProps} />
    </div>
  )
}

const ListItemInner = memo(function ListItemInner(props: ListItemSimpleProps) {
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
    separatorProps,
    oneLine,
    before,
    above,
    iconBefore: iconBeforeProp,
    subTextOpacity = 0.6,
    after,
    indent = 0,
    alignItems,
    selectable,
    hideBorder,
    editable,
    onEdit,
    onStartEdit,
    onCancelEdit,
    deletable,
    onDelete,
    ...surfaceProps
  } = props
  const isFocused = useFocus()
  const isSelected = useIsSelected(props)
  const showChildren = !props.hideBody
  const showSubtitle = !!subTitle && !props.hideSubtitle
  const showDate = !!date && !props.hideDate
  const showIcon = !!icon && !props.hideIcon
  const showTitle = !!title && !props.hideTitle
  const showPreview = !!preview && !children && !props.hideBody
  const showPreviewInSubtitle = !showTitle && oneLine
  // 13 instead of 12px here fixed a very odd clipping bug
  const iconBefore = iconBeforeProp || !showTitle
  const hasMouseDownEvent = !!surfaceProps.onMouseDown
  const disablePsuedoProps = selectable === false && {
    hoverStyle: null,
    activeStyle: null,
  }

  const iconElement = showIcon && getIcon(props)
  const listItemAdjustedPadding = usePadding({ padding: selectDefined(padding, 12) })
  const space = listItemAdjustedPadding ? listItemAdjustedPadding.paddingTop : undefined

  const hasChildren = showChildren && !!children
  const childrenElement = hasChildren && (
    <SimpleText margin={['auto', 0]} flex={1} size={0.9} alpha={subTextOpacity}>
      {children}
    </SimpleText>
  )

  // TODO could let a prop control content
  const afterHeaderElement = showDate && (
    <AfterHeader>
      <Stack direction="horizontal">
        <Text alpha={0.6} size={0.9} fontWeight={400}>
          <DateFormat date={date} nice={differenceInCalendarDays(Date.now(), date) < 7} />
        </Text>
      </Stack>
    </AfterHeader>
  )

  const locationElement = !!location && (
    <>
      <RoundButtonSmall
        coat="flat"
        borderWidth={0}
        margin={[2, 0]}
        maxWidth={120}
        alpha={subTextOpacity}
        onClick={onClickLocation || undefined}
        ellipse
      >
        {`${location}`}
      </RoundButtonSmall>
      <Space size={space} />
    </>
  )

  const hasAfterTitle = !!(props.afterTitle || afterHeaderElement)
  const coat = isSelected ? (isFocused ? 'selected' : 'selectedInactive') : undefined

  // its a lot easier at times to just get the props from the click event
  const handleClick = useCallback(
    onClick
      ? e => {
          onClick(e, props)
        }
      : idFn,
    [onClick],
  )

  // move click to mouseup and automatically wrap click if wanted
  // TODO check why this logic is necessary, has to do with selection/drag
  const handleMouseUp = useCallback(
    e => {
      !!surfaceProps.onMouseUp && surfaceProps.onMouseUp!(e)
      hasMouseDownEvent && handleClick(e)
    },
    [hasMouseDownEvent, surfaceProps.onMouseUp, handleClick],
  )

  return (
    <>
      {above && <Theme coat={coat}>{above}</Theme>}
      {/* unset the theme for the separator */}
      {!!separator && (
        // remove any special indicator we add for alt themes
        // TODO this is awkward (the split)
        <>
          {isValidElement(separator) ? (
            separator
          ) : (
            <ListSeparator {...separatorProps}>{separator}</ListSeparator>
          )}
        </>
      )}
      <Surface
        className="list-item-surface"
        flexDirection="row"
        alignItems="stretch"
        coat={coat}
        borderRadius={borderRadius}
        onClick={(!hasMouseDownEvent && handleClick) || undefined}
        background={coat ? undefined : 'transparent'}
        baseOverridesPsuedo={false}
        {...listItemAdjustedPadding}
        paddingLeft={
          (indent || 1) * (listItemAdjustedPadding ? listItemAdjustedPadding.paddingLeft : 0)
        }
        width="100%"
        before={
          <>
            {before}
            {!!before && <Space size={space} />}
            {!hideBorder && <BorderBottom right={5} left={5} opacity={0.5} />}
          </>
        }
        space={space}
        icon={iconBefore && iconElement}
        noInnerElement={!iconElement}
        {...disablePsuedoProps}
        {...surfaceProps}
        onMouseUp={handleMouseUp}
      >
        <ListItemMainContent>
          <View flex={1}>
            {showTitle && (
              <ListItemTitleBar direction="horizontal" space={space} alignItems={alignItems}>
                {showIcon && !iconBefore && iconElement}
                {isValidElement(title) ? (
                  title
                ) : (
                  <HighlightText
                    autoselect
                    editable={editable}
                    onFinishEdit={onEdit}
                    onCancelEdit={onCancelEdit}
                    onStartEdit={onStartEdit}
                    flex={1}
                    ellipse
                    fontWeight={400}
                    {...titleProps}
                  >
                    {title}
                  </HighlightText>
                )}
              </ListItemTitleBar>
            )}
            {showSubtitle && (
              <>
                <Space size={space / 2} />
                <ListItemSubtitle>
                  {!!location && locationElement}
                  {!!subTitle &&
                    (typeof subTitle === 'string' ? (
                      <HighlightText
                        className="ui-list-item-subtitle-text"
                        alpha={subTextOpacity}
                        size={0.9}
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
                      <div style={{ display: 'flex', flex: showPreviewInSubtitle ? 0 : 1 }} />
                    </>
                  )}
                  {!showTitle && (
                    <>
                      <Space />
                      {afterHeaderElement}
                    </>
                  )}
                </ListItemSubtitle>
              </>
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
            {coat ? <ThemeByName>{childrenElement}</ThemeByName> : childrenElement}
          </View>
          {hasAfterTitle && (
            <>
              <Space data-is="AfterTitleSpace" size={space} />
              <Stack space={space}>
                {props.afterTitle}
                {afterHeaderElement}
              </Stack>
            </>
          )}
        </ListItemMainContent>
        {/* TODO we should make this a right click option at least in electron */}
        {!!deletable && (
          <>
            <Space />
            <Button
              className="ui-listitem-delete"
              chromeless
              circular
              icon="cross"
              opacity={0.35}
              hoverStyle={{
                opacity: 1,
              }}
              onMouseDown={e => {
                e.stopPropagation()
              }}
              onClick={() => {
                if (window.confirm(`Are you sure you'd like to delete?`)) {
                  onDelete(props)
                }
              }}
            />
          </>
        )}
        {!!after && (
          <>
            <Space />
            {after}
          </>
        )}
      </Surface>
    </>
  )
}, isEqual)

const ListItemTitleBar = gloss(Stack, {
  width: '100%',
  flex: 1,
  justifyContent: 'flex-start',
  alignItems: 'flex-start',
  textAlign: 'left',
})

const Preview = gloss(Box, {
  flex: 1,
  zIndex: -1,
})

const ListItemSubtitle = gloss(View, {
  flexDirection: 'row',
  alignItems: 'center',
  flex: 1,
  overflow: 'hidden',
  // prevents RoundButton/location from getting cropped
  minHeight: 'min-content',
})

const AfterHeader = gloss(Box, {
  alignItems: 'flex-end',
  // why? for some reason this is really hard to align the text with the title,
  // check the visual date in list items to see if this helps align it in the row
  marginBottom: -4,
})

const ListItemMainContent = gloss(Box, {
  flex: 1,
  margin: ['auto', 0],
  flexDirection: 'row',
})

const getIconSize = props =>
  props.iconSize ||
  (props.iconProps && props.iconProps.size) ||
  (props.iconBefore ? (!(props.subTitle || props.children) ? 20 : 24) : 14)

function getIcon(props: ListItemSimpleProps) {
  const size = getIconSize(props)
  const iconPropsFinal = {
    size,
    ...props.iconProps,
  }
  let element = props.icon
  if (React.isValidElement(props.icon)) {
    const type = props.icon.type
    // @ts-ignore
    if (type.acceptsProps && type.acceptsProps.icon) {
      element = React.cloneElement(props.icon, iconPropsFinal)
    }
  } else {
    element = <Icon name={props.icon} {...iconPropsFinal} />
  }
  return element
}

import * as React from 'react'
import { view, attach } from '@mcro/black'
import * as UI from '@mcro/ui'
import { OrbitIcon } from './OrbitIcon'
import { normalizeItem, NormalizedItem } from '../helpers/normalizeItem'
import { PeopleRow } from '../components/PeopleRow'
import { CSSPropertySet } from '@mcro/gloss'
import { RoundButtonSmall } from './RoundButtonSmall'
import { DateFormat } from './DateFormat'
import { differenceInCalendarDays } from 'date-fns/esm/fp'
import { ItemProps } from './OrbitItemProps'
import { OrbitItemStore } from './OrbitItemStore'
import { HighlightText } from './HighlightText'
import { Row, Text, View } from '@mcro/ui'
import { HorizontalSpace } from '.'
import { Separator } from './Separator'

@attach('sourcesStore', 'appStore')
@attach({
  store: OrbitItemStore,
})
@view
export class OrbitListInner extends React.Component<ItemProps<any>> {
  static defaultProps = {
    // offsets -1px on sides for the negative margin we usually use to hide side border
    padding: [10, 11],
  }

  getInner = (normalizedItem: Partial<NormalizedItem>) => {
    const {
      createdAt,
      icon,
      location,
      people,
      preview,
      subtitle,
      title,
      updatedAt,
    } = normalizedItem
    const {
      borderRadius,
      cardProps,
      children,
      disableShadow,
      hoverToSelect,
      iconProps,
      inactive,
      onClick,
      store,
      titleProps,
      subtitleProps,
      padding,
      subtitleSpaceBetween,
      searchTerm,
      onClickLocation,
      renderText,
      separator,
      extraProps,
      isExpanded,
      ...props
    } = this.props
    const { isSelected } = store
    let ItemView
    if (!this.props.direct) {
      ItemView = this.props.sourcesStore.getView(normalizedItem.integration, 'item')
    }
    const hide = {
      ...this.props.hide,
      ...(ItemView && ItemView.itemProps && ItemView.itemProps.hide),
    }
    const showChildren = !(hide && hide.body)
    const showSubtitle = (!!subtitle || !!location) && !(hide && hide.subtitle)
    const showDate = !!createdAt && !(hide && hide.date)
    const showIcon = !!icon && !(hide && hide.icon)
    const showTitle = !(hide && hide.title)
    const showPeople = !!(
      !(hide && hide.people) &&
      people &&
      people.length &&
      people[0].data['profile']
    )
    const showPreview = !!preview && !children && !(hide && hide.body)
    const oneLine = extraProps && extraProps.oneLine
    const afterHeader = (
      <AfterHeader>
        <Row>
          {showDate && (
            <UI.Text alpha={0.6} size={0.9} fontWeight={600}>
              <DateFormat
                date={new Date(updatedAt)}
                nice={differenceInCalendarDays(Date.now, updatedAt) < 7}
              />
            </UI.Text>
          )}
        </Row>
      </AfterHeader>
    )

    let renderedChildren = null
    if (showChildren) {
      renderedChildren = children
      if (ItemView) {
        renderedChildren = (
          <ItemView
            model={this.props.model}
            bit={this.props.model}
            searchTerm={this.props.searchTerm}
            shownLimit={10}
            renderText={renderText}
            extraProps={this.props.extraProps}
            normalizedItem={normalizedItem}
            {...ItemView.itemProps}
          />
        )
      }
    }

    return (
      <ListFrame
        isExpanded={isExpanded}
        {...hoverToSelect && !inactive && store.hoverSettler && store.hoverSettler.props}
        forwardRef={store.setCardWrapRef}
        {...props}
      >
        {!!separator && (
          <Separator>
            <Text size={0.9} fontWeight={500}>
              {separator}
            </Text>
          </Separator>
        )}
        <ListItem
          isSelected={isSelected}
          borderRadius={borderRadius}
          onClick={store.handleClick}
          disableShadow={disableShadow}
          padding={padding}
          {...cardProps}
        >
          <div style={{ flexDirection: 'row', width: '100%' }}>
            <ListItemMainContent oneLine={oneLine}>
              {showTitle && (
                <Title>
                  {showIcon && (
                    <>
                      <OrbitIcon icon={icon} size={14} marginTop={2} {...iconProps} />
                      <TitleSpace />
                    </>
                  )}
                  <HighlightText
                    fontSize={15}
                    sizeLineHeight={0.85}
                    ellipse
                    fontWeight={700}
                    {...titleProps}
                  >
                    {title}
                  </HighlightText>
                  <TitleSpace />
                  {this.props.afterTitle || normalizedItem.afterTitle}
                  {afterHeader}
                </Title>
              )}
              {showSubtitle && (
                <ListItemSubtitle margin={showTitle ? [3, 0, 0] : 0}>
                  {showIcon &&
                    !showTitle && (
                      <>
                        <OrbitIcon icon={icon} size={14} {...iconProps} />
                        <TitleSpace />
                      </>
                    )}
                  {!!location && (
                    <>
                      <RoundButtonSmall
                        margin={-3}
                        maxWidth={120}
                        fontWeight={600}
                        onClick={store.handleClickLocation}
                      >
                        <Text ellipse ignoreColor>
                          {location}
                        </Text>
                      </RoundButtonSmall>
                      <TitleSpace />
                    </>
                  )}
                  {!!subtitle &&
                    (typeof subtitle === 'string' ? (
                      <UI.Text alpha={0.55} ellipse {...subtitleProps}>
                        {subtitle}
                      </UI.Text>
                    ) : (
                      subtitle
                    ))}
                  {!subtitle && (
                    <>
                      <div style={{ flex: 1 }} />
                      <PeopleRow people={people} />
                    </>
                  )}
                  {!showTitle && (
                    <>
                      {oneLine ? renderedChildren : null}
                      <HorizontalSpace />
                      {afterHeader}
                    </>
                  )}
                </ListItemSubtitle>
              )}
              {!showSubtitle &&
                (hide && hide.title) && (
                  <View
                    position="absolute"
                    right={Array.isArray(padding) ? padding[0] : padding}
                    top={Array.isArray(padding) ? padding[1] : padding}
                  >
                    {afterHeader}
                  </View>
                )}
              {/* vertical space only if needed */}
              {showSubtitle &&
                (!!children || !!preview) && <div style={{ flex: 1, maxHeight: 4 }} />}
              {showPreview && (
                <Preview>
                  {typeof preview !== 'string' && preview}
                  {typeof preview === 'string' && (
                    <HighlightText alpha={0.65} size={1.1} sizeLineHeight={0.9} ellipse={5}>
                      {preview}
                    </HighlightText>
                  )}
                </Preview>
              )}
              {!showTitle && oneLine ? null : renderedChildren}
              {showPeople &&
                !showSubtitle && (
                  <Bottom>
                    <PeopleRow people={people} />
                  </Bottom>
                )}
            </ListItemMainContent>
            {this.props.after || normalizedItem.after}
          </div>
        </ListItem>
        <Divider />
      </ListFrame>
    )
  }

  render() {
    const { store, model, direct } = this.props
    store.isSelected
    if (direct) {
      return this.getInner(this.props)
    }
    return this.getInner(direct ? model : normalizeItem(model))
  }
}

// never let it update, this saves so much time we can just change key to change item

export class OrbitListItem extends React.Component<ItemProps<any>> {
  shouldComponentUpdate() {
    return false
  }

  render() {
    return <OrbitListInner {...this.props} />
  }
}

const ListFrame = view(UI.View, {
  position: 'relative',
  userSelect: 'none',
  isExpanded: {
    userSelect: 'auto',
  },
  transform: {
    z: 0,
  },
}).theme(({ theme, borderRadius }) => {
  return {
    color: theme.color,
    background: theme.listItemBackground || theme.background.alpha(0.5),
    borderRadius: borderRadius || 3,
  }
})

const Divider = view({
  height: 1,
  position: 'absolute',
  bottom: 0,
  left: 10,
  right: 10,
}).theme(({ theme }) => ({
  background: theme.color.alpha(0.017),
}))

const ListItem = view({
  overflow: 'hidden',
  position: 'relative',
  maxHeight: '100%',
  flex: 1,
  border: [1, 'transparent'],
  borderLeft: 'none',
  borderRight: 'none',
  transform: {
    z: 0,
  },
  chromeless: {
    border: [1, 'transparent'],
    background: 'transparent',
    padding: 8,
  },
}).theme(({ theme, isSelected, padding, chromeless }) => {
  let style: CSSPropertySet = {}
  if (chromeless) {
    return style
  }
  // LIST ITEM
  let listStyle
  // selected...
  if (isSelected) {
    listStyle = {
      background: theme.listItemBackgroundSelected || theme.background.alpha(0.25),
      borderColor: theme.borderSelected.alpha(0.5),
    }
  } else {
    listStyle = {
      '&:hover': {
        background: theme.listItemBackgroundHover,
      },
    }
  }
  style = {
    ...style,
    ...listStyle,
    padding,
    '&:active': {
      opacity: isSelected ? 1 : 0.8,
    },
  }
  return style
})

const Title = view({
  width: '100%',
  flexFlow: 'row',
  justifyContent: 'space-between',
  alignItems: 'flex-start',
})

const Preview = view({
  flex: 1,
  zIndex: -1,
})

const ListItemSubtitle = view(UI.View, {
  height: 20,
  padding: [0, 0, 4],
  flexFlow: 'row',
  alignItems: 'center',
})

const AfterHeader = view({
  alignItems: 'flex-end',
  // why? for some reason this is really hard to align the text with the title,
  // check the visual date in list items to see if this helps align it in the row
  marginBottom: -4,
})

const TitleSpace = view({
  minWidth: 8,
  shouldFlex: {
    flex: 1,
  },
})

const Bottom = view({
  flexFlow: 'row',
  alignItems: 'center',
})

const ListItemMainContent = view({
  flex: 1,
  maxWidth: '100%',
  margin: ['auto', 0],
  oneLine: {
    flexFlow: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
  },
})

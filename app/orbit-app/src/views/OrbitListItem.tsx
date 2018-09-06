import * as React from 'react'
import { view } from '@mcro/black'
import * as UI from '@mcro/ui'
import { OrbitIcon } from './OrbitIcon'
import { ItemResolver, ResolvedItem } from '../components/ItemResolver'
import { PeopleRow } from '../components/PeopleRow'
import { CSSPropertySet } from '@mcro/gloss'
import { RoundButtonSmall } from './RoundButtonSmall'
import isEqual from 'react-fast-compare'
import { DateFormat } from './DateFormat'
import { differenceInCalendarDays } from 'date-fns/esm/fp'
import { OrbitItemProps } from './OrbitItemProps'
import { OrbitItemStore } from './OrbitItemStore'
import { Actions } from '../actions/Actions'
import { HighlightText } from './HighlightText'

const ListFrame = view(UI.View, {
  position: 'relative',
  transform: {
    z: 0,
  },
})

ListFrame.theme = ({ theme, margin, borderRadius }) => {
  return {
    color: theme.color,
    background: theme.listItemBackground || theme.background.alpha(0.5),
    margin: typeof margin === 'undefined' ? [2, 5] : margin,
    borderRadius: borderRadius || 3,
  }
}

const Divider = view({
  height: 1,
  position: 'absolute',
  bottom: 0,
  left: 10,
  right: 10,
})

Divider.theme = ({ theme }) => ({
  background: theme.color.alpha(0.015),
})

const ListItem = view({
  overflow: 'hidden',
  position: 'relative',
  maxHeight: '100%',
  flex: 1,
  border: [1, 'transparent'],
  transform: {
    z: 0,
  },
  chromeless: {
    border: [1, 'transparent'],
    background: 'transparent',
    padding: 8,
  },
})

ListItem.theme = ({ theme, isSelected, padding, chromeless }) => {
  let style: CSSPropertySet = {}
  if (chromeless) {
    return style
  }
  // LIST ITEM
  let listStyle
  // selected...
  if (isSelected) {
    listStyle = {
      background:
        theme.listItemBackgroundSelected || theme.background.alpha(0.25),
      border: [1, theme.borderSelected.alpha(0.5)],
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
}

const Title = view({
  maxWidth: '100%',
  flexFlow: 'row',
  justifyContent: 'space-between',
  alignItems: 'center',
})

const Preview = view({
  flex: 1,
  zIndex: -1,
})

const CardSubtitle = view(UI.View, {
  height: 20,
  margin: [3, 0, 0],
  padding: [2, 0, 2, 0],
  flexFlow: 'row',
  alignItems: 'center',
  listItem: {
    margin: [6, 0, 0],
  },
})

const AfterHeader = view({
  flexFlow: 'row',
  alignItems: 'center',
})

const Bottom = view({
  flexFlow: 'row',
  alignItems: 'center',
})

@view.attach('appStore', 'selectionStore', 'paneManagerStore', 'subPaneStore')
@view.attach({
  store: OrbitItemStore,
})
@view
export class OrbitListInner extends React.Component<OrbitItemProps> {
  static defaultProps = {
    padding: [6, 10],
  }

  getInner = (contentProps: ResolvedItem) => {
    const {
      createdAt,
      icon,
      location,
      locationLink,
      people,
      preview,
      subtitle,
      title,
      updatedAt,
    } = contentProps
    const {
      afterTitle,
      borderRadius,
      cardProps,
      children,
      disableShadow,
      hide,
      hoverToSelect,
      iconProps,
      inactive,
      onClick,
      selectionStore,
      store,
      titleProps,
      subtitleProps,
      padding,
      titleFlex,
      subtitleSpaceBetween,
      searchTerm,
      onClickLocation,
      model,
      ...props
    } = this.props
    const { isSelected } = store
    const showSubtitle = !!(location || subtitle) && !(hide && hide.subtitle)
    const showDate = !!createdAt && !(hide && hide.date)
    const showIcon = !!icon && !(hide && hide.icon)
    const showTitle = !(hide && hide.title)
    const afterHeader = (
      <AfterHeader>
        {showDate && (
          <UI.Text alpha={0.6} size={0.9} fontWeight={400}>
            <DateFormat
              date={new Date(updatedAt)}
              nice={differenceInCalendarDays(Date.now, updatedAt) < 7}
            />
          </UI.Text>
        )}
        <div style={{ width: 8 }} />
        <RoundButtonSmall
          icon="link"
          size={1.1}
          tooltip="Open"
          opacity={0.5}
          background="transparent"
          onClick={e => {
            console.log('opening', model)
            e.preventDefault()
            e.stopPropagation()
            Actions.openItem(model)
            Actions.closeOrbit()
          }}
        />
      </AfterHeader>
    )
    return (
      <ListFrame
        {...hoverToSelect && !inactive && store.hoverSettler.props}
        forwardRef={store.setCardWrapRef}
        zIndex={isSelected ? 5 : 4}
        {...props}
      >
        <ListItem
          isSelected={isSelected}
          borderRadius={borderRadius}
          onClick={store.handleClick}
          disableShadow={disableShadow}
          padding={padding}
          {...cardProps}
        >
          {showTitle && (
            <Title style={titleFlex && { flex: titleFlex }}>
              {showIcon && (
                <>
                  <OrbitIcon icon={icon} size={16} {...iconProps} />
                  <div style={{ width: 8 }} />
                </>
              )}
              <HighlightText
                fontSize={15}
                sizeLineHeight={0.85}
                ellipse={2}
                fontWeight={700}
                maxWidth="calc(100% - 30px)"
                {...titleProps}
              >
                {title}
              </HighlightText>
              {afterTitle}
              {afterHeader}
            </Title>
          )}
          {showSubtitle && (
            <CardSubtitle>
              {showIcon &&
                !showTitle && (
                  <>
                    <OrbitIcon icon={icon} size={16} {...iconProps} />
                    <div style={{ width: 8 }} />
                  </>
                )}
              {!!location && (
                <RoundButtonSmall
                  marginLeft={-3}
                  onClick={
                    onClickLocation
                      ? e => onClickLocation(e, contentProps)
                      : () => Actions.open(locationLink)
                  }
                >
                  {location}
                </RoundButtonSmall>
              )}
              {subtitleSpaceBetween}
              {typeof subtitle === 'string' ? (
                <UI.Text alpha={0.55} ellipse {...subtitleProps}>
                  {subtitle}
                </UI.Text>
              ) : (
                subtitle
              )}
              {hide && hide.title && afterHeader}
            </CardSubtitle>
          )}
          {/* vertical space only if needed */}
          {showSubtitle &&
            (!!children || !!preview) && (
              <div style={{ flex: 1, maxHeight: 4 }} />
            )}
          {!!preview &&
            !children &&
            !(hide && hide.body) && (
              <Preview>
                {typeof preview !== 'string' && preview}
                {typeof preview === 'string' && (
                  <HighlightText alpha={0.7} size={1.1} sizeLineHeight={0.9}>
                    {preview}
                  </HighlightText>
                )}
              </Preview>
            )}
          {typeof children === 'function'
            ? children(contentProps, model, props.index)
            : children}
          <Bottom>
            {!(hide && hide.people) &&
            model.integration !== 'slack' &&
            people &&
            people.length &&
            people[0].data.profile ? (
              <div>
                <PeopleRow people={people} />
              </div>
            ) : null}
          </Bottom>
        </ListItem>
        <Divider />
      </ListFrame>
    )
  }

  render() {
    const {
      selectionStore,
      store,
      pane,
      model,
      itemProps,
      searchTerm,
      isExpanded,
      hide,
      ...props
    } = this.props
    console.log(
      `${props.index} ${(model && (model.id || model.email)) ||
        props.title}.${pane} ${store.isSelected}`,
    )
    if (!model) {
      return this.getInner(props)
    }
    store.isSelected
    return (
      <ItemResolver
        model={model}
        isExpanded={isExpanded}
        searchTerm={searchTerm}
        hide={hide}
        {...itemProps}
      >
        {this.getInner}
      </ItemResolver>
    )
  }
}

// wrap the outside so we can do much faster shallow renders when need be
export class OrbitListItem extends React.Component<OrbitItemProps> {
  shouldComponentUpdate(nextProps) {
    return !isEqual(this.props, nextProps)
  }

  render() {
    return <OrbitListInner {...this.props} />
  }
}

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
import { App } from '@mcro/stores'

const CardWrap = view(UI.View, {
  position: 'relative',
  width: '100%',
  transform: {
    z: 0,
  },
})

const Divider = view({
  height: 1,
  background: [0, 0, 0, 0.08],
  position: 'absolute',
  bottom: 0,
  left: 10,
  right: 10,
})

const ListItem = view({
  overflow: 'hidden',
  position: 'relative',
  maxHeight: '100%',
  transform: {
    z: 0,
  },
  chromeless: {
    border: [1, 'transparent'],
    background: 'transparent',
    padding: [10, 12],
  },
})

ListItem.theme = ({ inGrid, theme, isSelected, padding, chromeless }) => {
  let card: CSSPropertySet = {
    flex: inGrid ? 1 : 'none',
  }
  if (chromeless) {
    return card
  }
  // LIST ITEM
  let listStyle
  // selected...
  if (isSelected) {
    listStyle = {
      background: theme.background.alpha(0.25),
      // border: [1, borderSelected],
      // boxShadow: disabledShadow || [[0, 0, 0, 1, '#90b1e4']],
    }
  } else {
    listStyle = {
      // border: [1, 'transparent'],
      '&:hover': {
        background: theme.backgroundHover.alpha(0.15),
      },
    }
  }
  card = {
    ...card,
    ...listStyle,
    borderLeft: 'none',
    borderRight: 'none',
    padding: padding || [12, 14],
    '&:active': {
      opacity: isSelected ? 1 : 0.8,
    },
  }
  return card
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
      inGrid,
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
            App.actions.openItem(model)
            App.actions.closeOrbit()
          }}
        />
      </AfterHeader>
    )
    return (
      <CardWrap
        {...hoverToSelect && !inactive && store.hoverSettler.props}
        forwardRef={store.setCardWrapRef}
        zIndex={isSelected ? 5 : 4}
        {...props}
      >
        <ListItem
          isSelected={isSelected}
          borderRadius={borderRadius}
          inGrid={inGrid}
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
              <UI.Text
                fontSize={15}
                sizeLineHeight={0.85}
                ellipse={2}
                fontWeight={700}
                maxWidth="calc(100% - 30px)"
                {...titleProps}
              >
                {title}
              </UI.Text>
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
                      : () => App.actions.open(locationLink)
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
                  <UI.Text
                    alpha={0.7}
                    size={1.1}
                    sizeLineHeight={0.9}
                    margin={inGrid ? ['auto', 0] : 0}
                  >
                    {preview}
                  </UI.Text>
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
      </CardWrap>
    )
  }

  render() {
    const {
      selectionStore,
      store,
      pane,
      model,
      itemProps,
      inGrid,
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

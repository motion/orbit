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
import { OrbitItemProps } from './OrbitItemProps'
import { OrbitItemStore } from './OrbitItemStore'
import { Actions } from '../actions/Actions'
import { HighlightText } from './HighlightText'

const VerticalSpaceSmall = view({
  height: 5,
})

const CardWrap = view(UI.View, {
  position: 'relative',
  width: '100%',
  transform: {
    z: 0,
  },
})

const Card = view({
  overflow: 'hidden',
  position: 'relative',
  maxHeight: '100%',
  transform: {
    z: 0,
  },
  chromeless: {
    border: [1, 'transparent'],
    background: 'transparent',
    padding: [12, 12, 12, 10],
    '&:hover': {
      background: [0, 0, 0, 0.025],
    },
  },
})

const cardHoverGlow = [0, 0, 0, 2, [0, 0, 0, 0.05]]

Card.theme = ({
  borderRadius,
  inGrid,
  theme,
  isSelected,
  background,
  border,
  padding,
  disableShadow,
  chromeless,
  color,
}) => {
  let card: CSSPropertySet = {
    flex: inGrid ? 1 : 'none',
    color: color || theme.color,
  }
  if (chromeless) {
    return card
  }
  const disabledShadow = disableShadow ? 'none' : null
  const cardShadow = theme.cardShadow || [0, 6, 14, [0, 0, 0, 0.12]]
  card = {
    ...card,
    padding,
    borderRadius: borderRadius || 7,
    background:
      background || theme.cardBackground || theme.background.alpha(0.9),
    ...theme.card,
  }
  if (!isSelected) {
    card = {
      ...card,
      boxShadow: disabledShadow || [cardShadow],
      border: border || [1, theme.cardBorderColor || 'transparent'],
      '&:hover': {
        boxShadow: disabledShadow || [cardShadow, cardHoverGlow],
        border: [1, [255, 255, 255, 0.25]],
      },
    }
  } else {
    card = {
      ...card,
      boxShadow: disabledShadow || [cardShadow, theme.shadowSelected],
      border: [1, theme.borderSelected],
      '&:hover': {
        border: [1, theme.borderSelected],
      },
    }
  }
  card = {
    ...card,
    '&:active': {
      opacity: 0.8,
    },
  }
  return card
}

const Title = view({
  maxWidth: '100%',
  flexFlow: 'row',
  justifyContent: 'space-between',
  padding: [0, 0, 2],
})

const Preview = view({
  flex: 1,
  zIndex: -1,
})

const CardSubtitle = view(UI.View, {
  height: 20,
  padding: [0, 0, 3, 0],
  flexFlow: 'row',
  alignItems: 'center',
  listItem: {
    margin: [6, 0, 0],
  },
})

const orbitIconProps = {
  orbitIconStyle: {
    marginRight: -2,
  },
}

@view.attach('appStore', 'selectionStore', 'paneManagerStore', 'subPaneStore')
@view.attach({
  store: OrbitItemStore,
})
@view
export class OrbitCardInner extends React.Component<OrbitItemProps> {
  static defaultProps = {
    padding: 8,
  }

  getOrbitCard = (contentProps: ResolvedItem) => {
    const {
      createdAt,
      icon,
      location,
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
      // ignore so it doesnt add tooltip to div
      title: _ignoreTitle,
      onClickLocation,
      ...props
    } = this.props
    const { isSelected } = store
    const hasMeta = !!(location || updatedAt) && !(hide && hide.meta)
    const hasPreview = !!preview && !children && !(hide && hide.body)
    const hasSubtitle = !!subtitle
    let topPad = 10
    let sidePad = 10
    if (props.padding) {
      if (Array.isArray(props.padding)) {
        topPad = props.padding[0]
        sidePad = props.padding[1]
      } else {
        topPad = props.padding
        sidePad = props.padding
      }
    }
    return (
      <CardWrap
        {...hoverToSelect && !inactive && store.hoverSettler.props}
        forwardRef={store.setCardWrapRef}
        zIndex={isSelected ? 5 : 4}
        {...props}
      >
        <Card
          isSelected={isSelected}
          borderRadius={borderRadius}
          inGrid={inGrid}
          onClick={store.handleClick}
          disableShadow={disableShadow}
          padding={padding}
          {...cardProps}
        >
          {!!icon &&
            !(hide && hide.icon) && (
              <OrbitIcon
                icon={icon}
                size={20}
                {...orbitIconProps}
                position="absolute"
                top={topPad}
                right={sidePad}
                {...iconProps}
              />
            )}
          {!(hide && hide.title) && (
            <Title>
              <HighlightText
                fontSize={14}
                sizeLineHeight={0.85}
                ellipse={hasSubtitle && hasMeta ? true : 2}
                fontWeight={600}
                maxWidth="calc(100% - 30px)"
                {...titleProps}
              >
                {title}
              </HighlightText>
              {afterTitle}
            </Title>
          )}
          {!!titleFlex && <div style={{ flex: titleFlex }} />}
          {hasSubtitle && (
            <CardSubtitle paddingRight={30}>
              <UI.Text alpha={0.55} ellipse {...subtitleProps}>
                {subtitle}
              </UI.Text>
              {hasMeta && <VerticalSpaceSmall />}
            </CardSubtitle>
          )}
          {hasMeta && (
            <CardSubtitle>
              {!!location && (
                <RoundButtonSmall
                  marginLeft={-3}
                  onClick={
                    onClickLocation ? () => Actions.open(onClickLocation) : null
                  }
                >
                  {location}
                </RoundButtonSmall>
              )}
              {subtitleSpaceBetween}
              {!!createdAt && (
                <>
                  {!!location && <div style={{ width: 5 }} />}
                  <UI.Text alpha={0.65} size={0.9} ellipse>
                    <DateFormat date={new Date(updatedAt)} nice />
                  </UI.Text>
                </>
              )}
              {hasPreview && <VerticalSpaceSmall />}
            </CardSubtitle>
          )}
          {hasPreview && (
            <Preview>
              {typeof preview !== 'string' && preview}
              {typeof preview === 'string' && (
                <UI.Text
                  size={1.3}
                  sizeLineHeight={0.9}
                  margin={inGrid ? ['auto', 0] : 0}
                >
                  {preview}
                </UI.Text>
              )}
            </Preview>
          )}
          {typeof children === 'function'
            ? children(contentProps, props.bit, props.index)
            : children}
          {people && people.length ? (
            <div>
              <PeopleRow people={people} />
            </div>
          ) : null}
        </Card>
        {/* Keep this below card because Masonry uses a simple .firstChild to measure */}
        {/* {!disableShadow && (
          <UI.HoverGlow
            behind
            color="#000"
            resist={80}
            scale={0.99}
            offsetTop={isSelected ? 6 : 4}
            full
            blur={8}
            inverse
            opacity={isSelected ? 0.08 : 0.04}
            borderRadius={20}
            duration={100}
          />
        )} */}
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
      item,
      searchTerm,
      ...props
    } = this.props
    // console.log(
    //   `${props.index} ${(model && model.id) || props.title}.${pane} ${
    //     store.isSelected
    //   }`,
    // )
    if (!model) {
      return this.getOrbitCard(props)
    }
    store.isSelected
    return (
      <ItemResolver
        model={model}
        item={item}
        isExpanded={this.props.isExpanded}
        searchTerm={searchTerm}
        onResolvedItem={store.setResolvedItem}
        {...itemProps}
      >
        {this.getOrbitCard}
      </ItemResolver>
    )
  }
}

// wrap the outside so we can do much faster shallow renders when need be
export class OrbitCard extends React.Component<OrbitItemProps> {
  shouldComponentUpdate(nextProps) {
    return !isEqual(this.props, nextProps)
  }

  render() {
    return <OrbitCardInner {...this.props} />
  }
}

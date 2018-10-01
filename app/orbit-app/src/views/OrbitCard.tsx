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
import { HighlightText } from './HighlightText'
import { Glint, Row } from '@mcro/ui'
import { HorizontalSpace } from '.'
import { RECENT_HMR } from '../constants'

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
    // border: [1, 'transparent'],
    background: 'transparent',
    padding: [12, 12, 12, 10],
    '&:hover': {
      background: [0, 0, 0, 0.025],
    },
  },
}).theme(
  ({
    borderRadius,
    inGrid,
    theme,
    isSelected,
    background,
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
      borderRadius,
      background: background || theme.cardBackground || theme.background.alpha(0.9),
      ...theme.card,
    }
    if (!isSelected) {
      const borderColor = theme.cardBorderColor || 'transparent'
      const borderShadow = ['inset', 0, 0, 0, 1, borderColor]
      const hoverBorderShadow = ['inset', 0, 0, 0, 1, theme.cardBorderColorHover || borderColor]
      card = {
        ...card,
        boxShadow: disabledShadow || [cardShadow, borderShadow],
        '&:hover': {
          boxShadow: disabledShadow || [cardShadow, hoverBorderShadow, theme.cardHoverGlow],
        },
      }
    } else {
      const borderShadow = ['inset', 0, 0, 0, 1, theme.borderSelected]
      const boxShadow = disabledShadow || [cardShadow, theme.shadowSelected, borderShadow]
      card = {
        ...card,
        boxShadow,
        '&:hover': {
          boxShadow,
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
  },
)

const Title = view({
  maxWidth: '100%',
  flexFlow: 'row',
  justifyContent: 'space-between',
  padding: [0, 0, 4],
})

const Preview = view({
  flex: 1,
  zIndex: -1,
})

const CardSubtitle = view(UI.View, {
  height: 20,
  padding: [0, 0, 2, 0],
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

const Padding = view({
  position: 'relative',
  margin: 1,
  overflow: 'hidden',
  flex: 1,
})

@view.attach('selectionStore', 'paneManagerStore', 'subPaneStore')
@view.attach({
  store: OrbitItemStore,
})
@view
export class OrbitCardInner extends React.Component<OrbitItemProps> {
  static defaultProps = {
    borderRadius: 7,
    padding: 8,
  }

  getOrbitCard = (resolvedItem: ResolvedItem) => {
    const { icon, location, people, preview, subtitle, title, updatedAt } = resolvedItem
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
    const hasMeta = !!location && !(hide && hide.meta)
    const hasPreview = !!preview && !children && !(hide && hide.body)
    const hasSubtitle = !!subtitle
    const hasDate = !!updatedAt
    const hasPeople = !!people && !!people.length
    const hasFourRows =
      ((hasSubtitle || hasMeta) && hasPeople) ||
      ((hasSubtitle || hasPeople) && titleProps && titleProps.ellipse !== true)
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
    const date = hasDate && (
      <UI.Text alpha={0.65} size={0.9} ellipse>
        <DateFormat date={new Date(updatedAt)} nice />
      </UI.Text>
    )
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
          {...cardProps}
        >
          <Glint opacity={0.75} borderRadius={borderRadius} />
          <Padding style={{ borderRadius, padding }}>
            {!(hide && hide.title) && (
              <Title>
                <HighlightText
                  fontSize={14}
                  sizeLineHeight={0.78}
                  ellipse={hasSubtitle && hasMeta ? true : 2}
                  fontWeight={500}
                  selectable={false}
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
              </CardSubtitle>
            )}
            {!hasFourRows && hasDate && <CardSubtitle>{date}</CardSubtitle>}
            {hasMeta && (
              <CardSubtitle>
                {!!location && (
                  <RoundButtonSmall marginLeft={-3} onClick={store.handleClickLocation}>
                    {location}
                  </RoundButtonSmall>
                )}
                {subtitleSpaceBetween}
                {hasFourRows &&
                  hasDate && (
                    <>
                      {!!location && <div style={{ width: 5 }} />}
                      {date}
                    </>
                  )}
                {hasPreview && <VerticalSpaceSmall />}
              </CardSubtitle>
            )}
            {hasPreview && (
              <Preview>
                {typeof preview !== 'string' && preview}
                {typeof preview === 'string' && (
                  <UI.Text size={1.3} sizeLineHeight={0.9} margin={inGrid ? ['auto', 0] : 0}>
                    {preview}
                  </UI.Text>
                )}
              </Preview>
            )}
            {typeof children === 'function'
              ? children(resolvedItem, props.bit, props.index)
              : children}
            {hasPeople && (
              <Row>
                <PeopleRow people={people} />
                {/* to avoid hitting orbit icon */}
                <HorizontalSpace />
              </Row>
            )}

            {!!icon &&
              !(hide && hide.icon) && (
                <OrbitIcon
                  icon={icon}
                  size={14}
                  {...orbitIconProps}
                  position="absolute"
                  bottom={topPad}
                  right={sidePad}
                  {...iconProps}
                />
              )}
          </Padding>
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
      inGrid,
      item,
      searchTerm,
      extraProps,
      ...props
    } = this.props
    // console.log(`${props.index} ${(model && model.id) || props.title}.${pane} ${store.isSelected}`)
    if (!model) {
      return this.getOrbitCard(props)
    }
    store.isSelected
    return (
      <ItemResolver
        model={model}
        isExpanded={this.props.isExpanded}
        searchTerm={searchTerm}
        onResolvedItem={store.setResolvedItem}
        extraProps={extraProps}
      >
        {this.getOrbitCard}
      </ItemResolver>
    )
  }
}

// wrap the outside so we can do much faster shallow renders when need be
export class OrbitCard extends React.Component<OrbitItemProps<any>> {
  shouldComponentUpdate(nextProps) {
    return !isEqual(this.props, nextProps) || RECENT_HMR()
  }

  render() {
    return (
      <UI.ThemeContext.Consumer>
        {obj => {
          return (
            <UI.Theme
              name={obj.activeThemeName === 'clearLight' ? 'clearDark' : obj.activeThemeName}
            >
              <OrbitCardInner {...this.props} />
            </UI.Theme>
          )
        }}
      </UI.ThemeContext.Consumer>
    )
  }
}

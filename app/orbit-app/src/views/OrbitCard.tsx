import * as React from 'react'
import { view, attach } from '@mcro/black'
import * as UI from '@mcro/ui'
import { OrbitIcon } from './OrbitIcon'
import { normalizeItem, NormalizedItem } from '../helpers/normalizeItem'
import { PeopleRow } from '../components/PeopleRow'
import { CSSPropertySet } from '@mcro/gloss'
import { RoundButtonSmall } from './RoundButtonSmall'
import { DateFormat } from './DateFormat'
import { ItemProps } from './OrbitItemProps'
import { OrbitItemStore } from './OrbitItemStore'
import { HighlightText } from './HighlightText'
import { Glint, Row } from '@mcro/ui'
import { HorizontalSpace } from '.'
import { onlyUpdateOnChanged } from '../helpers/onlyUpdateOnChanged'
import { ResolvableModel } from '../sources/types'
import { Avatar } from './Avatar'

@attach('sourcesStore', 'appStore')
@attach({
  store: OrbitItemStore,
})
@view
export class OrbitCardInner extends React.Component<ItemProps<ResolvableModel>> {
  static defaultProps = {
    borderRadius: 7,
    padding: 8,
  }

  getInner = (item: Partial<NormalizedItem>) => {
    const { avatar, icon, location, people, preview, title, updatedAt } = item
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
      chromeless,
      activeStyle,
      ...props
    } = this.props

    // allow either custom subtitle or resolved one
    const subtitle = this.props.subtitle || item.subtitle
    const { isSelected } = store
    const ItemView = this.props.sourcesStore.getView(
      item.type === 'bit' ? item.integration : 'person',
      'item',
    )
    const hasChildren = typeof this.props.children !== 'undefined'
    const showChildren = !this.props.direct && !(hide && hide.body)
    const hasTitle = !!title && !(hide && hide.title)
    const hasMeta = !!location && !(hide && hide.meta)
    const hasPreview = !!preview && !children && !(hide && hide.body)
    const hasSubtitle = !!subtitle && !(hide && hide.subtitle)
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
    const dateContent = hasDate && (
      <UI.Text alpha={0.65} size={0.9} ellipse>
        <DateFormat date={new Date(updatedAt)} nice />
      </UI.Text>
    )
    return (
      <CardWrap
        {...hoverToSelect && !inactive && store.hoverSettler && store.hoverSettler.props}
        forwardRef={store.setCardWrapRef}
        {...props}
        {...isSelected && activeStyle}
      >
        <Card
          isSelected={isSelected}
          borderRadius={borderRadius}
          inGrid={inGrid}
          onClick={store.handleClick}
          disableShadow={disableShadow}
          chromeless={chromeless}
          {...cardProps}
        >
          {chromeless ? (
            children
          ) : (
            <>
              <Glint opacity={0.75} borderRadius={borderRadius} />
              <Padding style={{ borderRadius, padding }}>
                {hasTitle && (
                  <Title padRight>
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
                  <CardSubtitle padRight={!hasTitle} paddingRight={30}>
                    <UI.Text alpha={0.55} ellipse {...subtitleProps}>
                      {subtitle}
                    </UI.Text>
                  </CardSubtitle>
                )}
                {!hasFourRows &&
                  hasDate && <CardSubtitle padRight={!hasTitle}>{dateContent}</CardSubtitle>}
                {hasMeta && (
                  <CardSubtitle padRight={!hasTitle}>
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
                          {dateContent}
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
                {!!avatar && <Avatar src={avatar} />}
                {hasChildren && children}
                {!hasChildren &&
                  showChildren && (
                    <ItemView
                      model={this.props.model}
                      bit={this.props.model}
                      searchTerm={this.props.searchTerm}
                      shownLimit={10}
                      extraProps={this.props.extraProps}
                    />
                  )}
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
                      top={topPad}
                      right={sidePad}
                      {...iconProps}
                    />
                  )}
              </Padding>
            </>
          )}
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
    const { store, model, direct } = this.props
    // lets react to this, keep this here to ensure we do
    store.isSelected
    if (direct) {
      return this.getInner(this.props)
    }
    if (!model) {
      return null
    }
    return this.getInner(normalizeItem(model))
  }
}

// wrap the outside so we can do much faster shallow renders when need be
export class OrbitCard extends React.Component<ItemProps<ResolvableModel>> {
  shouldComponentUpdate(a, b, c) {
    return onlyUpdateOnChanged.call(this, a, b, c)
  }

  render() {
    return <OrbitCardInner {...this.props} />
    // return (
    //   <UI.ThemeContext.Consumer>
    //     {obj => {
    //       const themeName = obj.activeThemeName === 'clearLight' ? 'clearDark' : obj.activeThemeName
    //       return (
    //         <UI.Theme name={themeName}>

    //         </UI.Theme>
    //       )
    //     }}
    //   </UI.ThemeContext.Consumer>
    // )
  }
}

const VerticalSpaceSmall = view({
  height: 5,
})

const CardWrap = view(UI.View, {
  position: 'relative',
  flex: 1,
  transform: {
    z: 0,
  },
})

const Card = view({
  overflow: 'hidden',
  position: 'relative',
  maxHeight: '100%',
  // this is for the shadow to not overflow...
  margin: 2,
  transform: {
    z: 0,
  },
  chromeless: {
    background: 'transparent',
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
    const disabledShadow = disableShadow ? 'none' : null
    const cardShadow = theme.cardShadow || [0, 6, 14, [0, 0, 0, 0.12]]
    card = {
      ...card,
      padding,
      borderRadius,
      background: background || theme.cardBackground || theme.background.alpha(0.9),
      ...theme.card,
    }
    if (isSelected === true) {
      const borderShadow = ['inset', 0, 0, 0, 1, theme.borderSelected]
      const boxShadow = disabledShadow || [cardShadow, theme.shadowSelected, borderShadow]
      card = {
        ...card,
        boxShadow,
        '&:hover': {
          boxShadow,
        },
      }
    } else {
      const borderColor = theme.cardBorderColor || 'transparent'
      const borderShadow = chromeless ? null : ['inset', 0, 0, 0, 1, borderColor]
      const hoverBorderShadow = ['inset', 0, 0, 0, 1, theme.cardBorderColorHover || borderColor]
      card = {
        ...card,
        boxShadow: disabledShadow || [cardShadow, borderShadow],
        '&:hover': {
          boxShadow: disabledShadow || [
            cardShadow,
            hoverBorderShadow,
            chromeless ? null : theme.cardHoverGlow,
          ],
        },
      }
    }
    card = {
      ...card,
      '&:active': {
        opacity: 0.8,
      },
    }
    if (chromeless) {
      return {
        ...card,
        background: 'transparent',
      }
    }
    return card
  },
)

const Title = view({
  maxWidth: '100%',
  flexFlow: 'row',
  justifyContent: 'space-between',
  padding: [0, 0, 2],
  padRight: {
    paddingRight: 20,
  },
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
  padRight: {
    paddingRight: 20,
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

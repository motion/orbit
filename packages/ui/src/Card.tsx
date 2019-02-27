import { CSSPropertySet, gloss, View } from '@mcro/gloss'
import { useStore } from '@mcro/use-store'
import * as React from 'react'
import { RoundButtonSmall } from './buttons/RoundButtonSmall'
import { Glint } from './effects/Glint'
import { ConfiguredIcon } from './Icon'
import { ListItemProps } from './lists/ListItem'
import { ListItemStore } from './lists/ListItemStore'
import { DateFormat } from './text/DateFormat'
import { HighlightText } from './text/HighlightText'
import { Text } from './text/Text'

export function Card({
  borderRadius = 7,
  padding = 8,
  icon,
  location,
  preview,
  title,
  afterTitle,
  cardProps,
  children,
  disableShadow,
  iconProps,
  inGrid,
  onClick,
  titleProps,
  subtitleProps,
  titleFlex,
  subtitleSpaceBetween,
  searchTerm,
  // ignore so it doesnt add tooltip to div
  title: _ignoreTitle,
  onClickLocation,
  chromeless,
  activeStyle,
  subtitle,
  date,
  ...props
}: ListItemProps) {
  const store = useStore(ListItemStore, props)
  // allow either custom subtitle or resolved one
  const { isSelected } = store
  const showChildren = typeof children !== 'undefined' && !props.hideBody
  const hasTitle = !!title && !props.hideTitle
  const hasMeta = !!location && !props.hideMeta
  const hasPreview = !!preview && !children && !props.hideBody
  const hasSubtitle = !!subtitle && !props.hideSubtitle
  const hasDate = !!date
  const hasFourRows =
    hasSubtitle || hasMeta || (hasSubtitle && titleProps && titleProps['ellipse'] !== true)
  let topPad = 10 as any
  let sidePad = 10 as any
  if (padding) {
    if (Array.isArray(padding)) {
      topPad = padding[0]
      sidePad = padding[1]
    } else {
      topPad = padding
      sidePad = padding
    }
  }
  const dateContent = hasDate && (
    <Text alpha={0.65} size={0.9} ellipse>
      <DateFormat date={new Date(date)} nice />
    </Text>
  )
  return (
    <CardWrap ref={store.setCardWrapRef} {...props} {...isSelected && activeStyle}>
      <CardChrome
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
                  <Text alpha={0.55} ellipse {...subtitleProps}>
                    {subtitle}
                  </Text>
                </CardSubtitle>
              )}
              {!hasFourRows && hasDate && (
                <CardSubtitle padRight={!hasTitle}>{dateContent}</CardSubtitle>
              )}
              {hasMeta && (
                <CardSubtitle padRight={!hasTitle}>
                  {!!location && (
                    <RoundButtonSmall marginLeft={-3} onClick={store.handleClickLocation}>
                      {location}
                    </RoundButtonSmall>
                  )}
                  {subtitleSpaceBetween}
                  {hasFourRows && hasDate && (
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
                    <Text size={1.3} sizeLineHeight={0.9} margin={inGrid ? ['auto', 0] : 0}>
                      {preview}
                    </Text>
                  )}
                </Preview>
              )}
              {showChildren && children}
              {/* {!hasChildren && showChildren && (
                <ItemView
                  model={props.model}
                  bit={props.model}
                  searchTerm={searchTerm}
                  shownLimit={10}
                  extraProps={props.extraProps}
                />
              )} */}
              {!!icon && !props.hideIcon && (
                <ConfiguredIcon
                  name={icon}
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
      </CardChrome>
      {/* Keep this below card because Masonry uses a simple .firstChild to measure */}
      {/* {!disableShadow && (
        <HoverGlow
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

const VerticalSpaceSmall = gloss({
  height: 5,
})

const CardWrap = gloss(View, {
  position: 'relative',
  flex: 1,
  transform: {
    z: 0,
  },
})

const CardChrome = gloss({
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

const Title = gloss({
  maxWidth: '100%',
  flexFlow: 'row',
  justifyContent: 'space-between',
  padding: [0, 0, 2],
  padRight: {
    paddingRight: 20,
  },
})

const Preview = gloss({
  flex: 1,
  zIndex: -1,
})

const CardSubtitle = gloss(View, {
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

const Padding = gloss({
  position: 'relative',
  margin: 1,
  overflow: 'hidden',
  flex: 1,
})

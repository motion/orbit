import { gloss } from '@o/gloss'
import { useStore } from '@o/use-store'
import * as React from 'react'
import { RoundButtonSmall } from './buttons/RoundButtonSmall'
import { Icon } from './Icon'
import { Space } from './layout/Space'
import { ListItemProps } from './lists/ListItem'
import { ListItemStore } from './lists/ListItemStore'
import { SizedSurface, SizedSurfaceProps } from './SizedSurface'
import { DateFormat } from './text/DateFormat'
import { SubTitle } from './text/SubTitle'
import { Text } from './text/Text'
import { Title } from './text/Title'

export type CardProps = SizedSurfaceProps & ListItemProps

export function Card({
  padding = 8,
  sizeRadius = true,
  icon,
  location,
  preview,
  title,
  afterTitle,
  children,
  iconProps,
  inGrid,
  onClick,
  titleProps,
  subtitleProps,
  titleFlex,
  searchTerm,
  // ignore so it doesnt add tooltip to div
  title: _ignoreTitle,
  onClickLocation,
  activeStyle,
  subtitle,
  date,
  ...props
}: CardProps) {
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
    <SizedSurface
      forwardRef={store.setCardWrapRef}
      borderWidth={1}
      {...props}
      {...isSelected && activeStyle}
      themeSelect="card"
      onClick={store.handleClick}
      sizeRadius={sizeRadius}
      noInnerElement
    >
      <Padding style={{ padding }}>
        {hasTitle && (
          <>
            <Title ellipse margin={0} highlight>
              {title}
            </Title>
            {afterTitle}
          </>
        )}
        {!!titleFlex && <div style={{ flex: titleFlex }} />}
        {hasSubtitle && (
          <SubTitle ellipse>
            <Text alpha={0.55} ellipse {...subtitleProps}>
              {subtitle}
            </Text>
          </SubTitle>
        )}
        {!hasFourRows && hasDate && <SubTitle>{dateContent}</SubTitle>}
        {hasMeta && (
          <SubTitle ellipse>
            {!!location && (
              <RoundButtonSmall marginLeft={-3} onClick={store.handleClickLocation}>
                {location}
              </RoundButtonSmall>
            )}
            {hasFourRows && hasDate && (
              <>
                {!!location && <div style={{ width: 5 }} />}
                {dateContent}
              </>
            )}
            {hasPreview && <Space small />}
          </SubTitle>
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
        {!!icon && !props.hideIcon && (
          <Icon
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
    </SizedSurface>
  )
}

const Preview = gloss({
  flex: 1,
  zIndex: -1,
})

const orbitIconProps = {
  orbitIconStyle: {
    marginRight: -2,
  },
}

const Padding = gloss({
  position: 'relative',
  margin: 1,
  overflowX: 'hidden',
  overflowY: 'auto',
  flex: 1,
})

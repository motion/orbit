import { Col, gloss, Row } from '@o/gloss'
import * as React from 'react'
import { RoundButtonSmall } from './buttons/RoundButtonSmall'
import { CollapsableProps, CollapseArrow } from './Collapsable'
import { Icon } from './Icon'
import { ListItemProps, useIsSelected } from './lists/ListItem'
import { SizedSurface, SizedSurfaceProps } from './SizedSurface'
import { DateFormat } from './text/DateFormat'
import { SubTitle } from './text/SubTitle'
import { Text } from './text/Text'
import { Title } from './text/Title'
import { View } from './View/View'

export type CardProps = SizedSurfaceProps & ListItemProps & Partial<CollapsableProps>

export function Card(props: CardProps) {
  const {
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
    titleProps,
    subtitleProps,
    titleFlex,
    // ignore so it doesnt add tooltip to div
    title: _ignoreTitle,
    onClickLocation,
    activeStyle,
    subTitle,
    date,
    collapsable,
    collapsed,
    onCollapse,
    ...restProps
  } = props
  const isSelected = useIsSelected(props)
  const showChildren = typeof children !== 'undefined' && !props.hideBody
  const hasTitle = !!title && !props.hideTitle
  const hasMeta = !!location && !props.hideMeta
  const hasPreview = !!preview && !children && !props.hideBody
  const hasSubtitle = !!subTitle && !props.hideSubtitle
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
      borderWidth={1}
      {...restProps}
      {...isSelected && activeStyle}
      themeSelect="card"
      sizeRadius={sizeRadius}
      noInnerElement
    >
      <Padding style={{ padding }}>
        {(hasTitle || hasSubtitle || hasMeta) && (
          <Row
            onDoubleClick={collapsable && (() => onCollapse(!collapsed))}
            padding={[0, 0, 10]}
            justifyContent="space-between"
            width="100%"
          >
            <Col>
              {hasTitle && (
                <>
                  <Title ellipse margin={0} highlight>
                    {title}
                  </Title>
                </>
              )}
              {!!titleFlex && <div style={{ flex: titleFlex }} />}
              {hasSubtitle && (
                <SubTitle ellipse marginTop={0} {...subtitleProps}>
                  {subTitle}
                </SubTitle>
              )}
              {!hasFourRows && hasDate && <SubTitle>{dateContent}</SubTitle>}
              {hasMeta && (
                <SubTitle ellipse>
                  {!!location && (
                    <RoundButtonSmall marginLeft={-3} onClick={onClickLocation}>
                      {location}
                    </RoundButtonSmall>
                  )}
                  {hasFourRows && hasDate && (
                    <>
                      {!!location && <div style={{ width: 5 }} />}
                      {dateContent}
                    </>
                  )}
                </SubTitle>
              )}
            </Col>
            <Col paddingTop={10}>
              {afterTitle}
              {collapsable && <CollapseArrow collapsed={collapsed} />}
            </Col>
          </Row>
        )}
        <View flex={1} height={collapsed ? 0 : '100%'}>
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
        </View>
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

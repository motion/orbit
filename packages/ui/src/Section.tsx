import { isDefined, selectDefined } from '@o/utils'
import React, { forwardRef } from 'react'
import { createContextualProps } from './helpers/createContextualProps'
import { SizedSurface } from './SizedSurface'
import { Sizes, Space } from './Space'
import { TitleRow, TitleRowSpecificProps } from './TitleRow'
import { Omit } from './types'
import { Col, ColProps } from './View/Col'

// useful for making a higher order component that uses Section internally
// & you dont want to pass *everything* done, this is a good subset
export type SectionSpecificProps = Omit<
  Partial<TitleRowSpecificProps>,
  'after' | 'below' | 'margin' | 'unpad' | 'size'
> & {
  size?: Sizes
  titleSize?: Sizes
  beforeTitle?: React.ReactNode
  belowTitle?: React.ReactNode
  afterTitle?: React.ReactNode
  titleBorder?: boolean
  below?: React.ReactNode
  innerRef?: any
  maxInnerHeight?: number
  padInner?: Sizes
  fixedTitle?: boolean
}

export type SectionParentProps = Omit<SectionSpecificProps, 'below' | 'innerRef'>

export type SectionProps = Omit<ColProps, 'onSubmit'> & SectionSpecificProps

const { useProps, Reset, PassProps } = createContextualProps<SectionProps>()
export const SectionPassProps = PassProps
export const useSectionProps = useProps

export const Section = forwardRef(function Section(direct: SectionProps, ref) {
  const props = useProps(direct)
  const {
    above,
    title,
    subTitle,
    scrollable,
    children,
    afterTitle,
    bordered,
    belowTitle,
    below,
    flex,
    icon,
    background,
    titleBorder,
    width,
    margin,
    height,
    maxHeight,
    maxInnerHeight,
    maxWidth,
    minHeight,
    beforeTitle,
    innerRef,
    flexDirection,
    space,
    spaceAround,
    pad,
    padInner,
    titleSize,
    size,
    fixedTitle,
    ...viewProps
  } = props
  const hasTitle = isDefined(title, afterTitle)
  const innerPad = selectDefined(padInner, !!(hasTitle || bordered) ? pad : null)
  const spaceSize = space === true ? selectDefined(size, space) : space
  const showTitleAbove = isDefined(fixedTitle, pad, scrollable)
  const titleElement = hasTitle && (
    <>
      <TitleRow
        bordered={bordered || titleBorder}
        backgrounded={bordered}
        title={title}
        subTitle={subTitle}
        after={afterTitle}
        above={above}
        before={beforeTitle}
        below={belowTitle}
        icon={icon}
        pad={innerPad || (titleBorder || bordered ? true : null)}
        size={selectDefined(titleSize, size)}
      />
      {!!spaceSize && !showTitleAbove && <Space size={spaceSize} />}
    </>
  )

  return (
    <SizedSurface
      forwardRef={ref}
      hoverStyle={null}
      activeStyle={null}
      sizeRadius={bordered ? 1 : 0}
      elevation={bordered ? 1 : 0}
      borderWidth={bordered ? 1 : 0}
      margin={typeof margin !== 'undefined' ? margin : bordered ? 10 : 0}
      noInnerElement
      flex={flex}
      background={background}
      height={height}
      // todo weird type issue
      width={width as any}
      maxHeight={maxHeight}
      maxWidth={maxWidth}
      minHeight={minHeight}
      overflow={isDefined(scrollable, maxHeight) ? 'hidden' : undefined}
      pad={!showTitleAbove ? pad : false}
      size={size}
    >
      {showTitleAbove && titleElement}
      <Reset>
        <Col
          maxHeight={maxInnerHeight}
          flex={1}
          ref={innerRef}
          space={spaceSize}
          spaceAround={spaceAround}
          flexDirection={flexDirection}
          scrollable={scrollable}
          pad={innerPad}
          beforeSpace={!showTitleAbove && titleElement}
          {...viewProps}
        >
          {children}
        </Col>
      </Reset>
      {below}
    </SizedSurface>
  )
})

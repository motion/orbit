import { isDefined, selectDefined } from '@o/utils'
import { Base, Theme } from 'gloss'
import React, { forwardRef, Suspense } from 'react'

import { BorderBottom } from './Border'
import { splitCollapseProps, useCollapse } from './Collapsable'
import { createContextualProps } from './helpers/createContextualProps'
import { Loading } from './progress/Loading'
import { Scale } from './Scale'
import { SizedSurface, SizedSurfaceProps } from './SizedSurface'
import { Sizes, Space } from './Space'
import { TitleRow, TitleRowSpecificProps } from './TitleRow'
import { Omit } from './types'
import { Col, ColProps } from './View/Col'

// useful for making a higher order component that uses Section internally
// & you dont want to pass *everything* done, this is a good subset
export type SectionSpecificProps = Partial<
  Omit<TitleRowSpecificProps, 'after' | 'below' | 'margin' | 'unpad' | 'size' | 'selectable'>
> & {
  /** Add shadow to section */
  elevation?: SizedSurfaceProps['elevation']

  /** Allow scaling just the TitleRow element */
  titleScale?: number

  /** Allow padding just the title element */
  titlePad?: Sizes

  /** Size the section: title, padding, border radius */
  size?: Sizes

  /** Set the title size */
  titleSize?: Sizes

  /** Insert an element before, horizontally */
  beforeTitle?: React.ReactNode

  /** Insert an element after, horizontally */
  afterTitle?: React.ReactNode

  /** Insert an element below the title */
  belowTitle?: React.ReactNode

  /** Adds a border below the title */
  titleBorder?: boolean

  /** Insert an element below the section */
  below?: React.ReactNode

  /** Attach a ref to the inner section div */
  innerRef?: any

  /** Limit the height of the inside of section */
  maxInnerHeight?: number

  /** Set padding of inside of section independently */
  padInner?: Sizes

  /** Prevent the title from scrolling when using scrollable property */
  fixedTitle?: boolean

  /** Override the <TitleRow /> entirely */
  titleElement?: React.ReactNode
}

export type SectionParentProps = Omit<SectionSpecificProps, 'below' | 'innerRef'>

export type SectionProps = Omit<ColProps, 'onSubmit'> & SectionSpecificProps

const { useProps, Reset, PassProps } = createContextualProps<SectionProps>()
export const SectionPassProps = PassProps
export const useSectionProps = useProps

const defaultTitlePad = ['lg', true, 'sm']

export const Section = forwardRef(function Section(direct: SectionProps, ref) {
  const allProps = useProps(direct)
  const [collapseProps, props] = splitCollapseProps(allProps)
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
    elevation,
    titleProps,
    backgrounded,
    titleScale,
    borderRadius,
    titleElement,
    titlePad,
    overflow,
    ...viewProps
  } = props
  const hasTitle = isDefined(title, afterTitle)
  const innerPad = selectDefined(padInner, !!(hasTitle || bordered || titleElement) ? pad : null)
  const spaceSize = !!space ? selectDefined(size, space) : space
  const showTitleAbove = isDefined(fixedTitle, pad, scrollable)
  const collapse = useCollapse(collapseProps)

  let titleEl: React.ReactNode = titleElement || null

  if (!titleElement && hasTitle) {
    const adjustPadProps = !bordered && !titleBorder && !backgrounded && { paddingBottom: 0 }

    titleEl = (
      <Scale size={titleScale}>
        <Theme alt="flat">
          <TitleRow
            backgrounded={selectDefined(backgrounded, bordered)}
            title={title}
            subTitle={subTitle}
            after={afterTitle}
            above={above}
            before={beforeTitle}
            below={belowTitle}
            icon={icon}
            userSelect="none"
            space="sm"
            pad={selectDefined(
              titlePad,
              titleBorder || bordered ? selectDefined(pad, defaultTitlePad) : null,
            )}
            size={selectDefined(titleSize, size)}
            titleProps={titleProps}
            useCollapse={collapse}
            {...adjustPadProps}
          />
        </Theme>
        {!!spaceSize && !showTitleAbove && <Space size={spaceSize} />}
      </Scale>
    )

    if (bordered || titleBorder) {
      titleEl = (
        <Base position="relative">
          {titleEl}
          {!!(bordered || titleBorder) && <BorderBottom opacity={0.5} />}
        </Base>
      )
    }
  }

  return (
    <SizedSurface
      forwardRef={ref}
      hoverStyle={null}
      activeStyle={null}
      sizeRadius={bordered ? 1 : 0}
      elevation={selectDefined(elevation, bordered ? 1 : 0)}
      borderWidth={bordered ? 1 : 0}
      margin={margin}
      noInnerElement
      flex={flex}
      background={background || 'transparent'}
      height={height}
      // todo weird type issue
      width={width as any}
      maxHeight={maxHeight}
      maxWidth={maxWidth}
      minHeight={minHeight}
      borderRadius={borderRadius}
      overflow={selectDefined(
        overflow,
        isDefined(scrollable, maxHeight, bordered, borderRadius) ? 'hidden' : undefined,
      )}
      pad={!showTitleAbove ? pad : false}
      size={size}
    >
      {showTitleAbove && titleEl}
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
          beforeSpace={!showTitleAbove && titleEl}
          useCollapse={collapse}
          overflow="hidden"
          {...viewProps}
        >
          <Suspense fallback={<Loading />}>{children}</Suspense>
        </Col>
      </Reset>
      {below}
    </SizedSurface>
  )
})

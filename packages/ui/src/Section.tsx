import { gloss } from '@o/gloss'
import React, { forwardRef } from 'react'
import { createContextualProps } from './helpers/createContextualProps'
import { PaddedProps } from './layout/Padded'
import { Scrollable } from './layout/Scrollable'
import { SizedSurface } from './SizedSurface'
import { TitleRow, TitleRowProps } from './TitleRow'
import { Omit } from './types'
import { View, ViewProps } from './View/View'

// useful for making a higher order component that uses Section internally
// & you dont want to pass *everything* done, this is a good subset
export type SectionSpecificProps = Omit<
  Partial<TitleRowProps>,
  'after' | 'below' | 'margin' | 'unpad'
> & {
  beforeTitle?: React.ReactNode
  belowTitle?: React.ReactNode
  afterTitle?: React.ReactNode
  titleBorder?: boolean
  below?: React.ReactNode
  innerRef?: any
  maxInnerHeight?: number
}

export type SectionParentProps = Omit<SectionSpecificProps, 'below' | 'innerRef'>

export type SectionProps = Omit<ViewProps, 'columns' | 'onSubmit'> &
  PaddedProps &
  SectionSpecificProps

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
    padded,
    background,
    titleBorder,
    width,
    margin,
    height,
    // to prevent accidental massive sizing, maybe weird
    maxHeight = window.innerHeight * 2,
    maxInnerHeight = window.innerHeight * 2,
    maxWidth,
    minHeight,
    beforeTitle,
    innerRef,
    ...viewProps
  } = props
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
      overflow={bordered ? 'hidden' : 'inherit'}
    >
      {!!(title || afterTitle) && (
        <TitleRow
          bordered={bordered || titleBorder}
          backgrounded={bordered}
          margin={0}
          title={title}
          subTitle={subTitle}
          after={afterTitle}
          above={above}
          before={beforeTitle}
          below={belowTitle}
          icon={icon}
        />
      )}
      <SectionInner maxHeight={maxInnerHeight} flex={1} ref={innerRef} {...viewProps}>
        <Scrollable scrollable={scrollable} padded={padded}>
          <Reset>{children}</Reset>
        </Scrollable>
      </SectionInner>
      {below}
    </SizedSurface>
  )
})

const SectionInner = gloss(View)

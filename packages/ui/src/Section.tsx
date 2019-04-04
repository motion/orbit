import { gloss, View, ViewProps } from '@o/gloss'
import React, { forwardRef } from 'react'
import { createContextualProps } from './helpers/createContextualProps'
import { Padded, PaddedProps } from './layout/Padded'
import { SizedSurface } from './SizedSurface'
import { TitleRow, TitleRowProps } from './TitleRow'
import { Omit } from './types'

export type SectionProps = Omit<ViewProps, 'columns'> &
  PaddedProps &
  Omit<Partial<TitleRowProps>, 'after' | 'below' | 'margin'> & {
    belowTitle?: React.ReactNode
    afterTitle?: React.ReactNode
    titleBorder?: boolean
    below?: React.ReactNode
    scrollable?: boolean
    innerRef?: any
    maxInnerHeight?: number
  }

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
    minHeight = 'min-content',
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
          below={belowTitle}
          icon={icon}
        />
      )}
      <SectionInner
        maxHeight={maxInnerHeight}
        overflowY={scrollable ? 'auto' : 'inherit'}
        flex={1}
        ref={innerRef}
        {...viewProps}
      >
        <Padded padded={padded}>
          <Reset>{children}</Reset>
        </Padded>
      </SectionInner>
      {below}
    </SizedSurface>
  )
})

const SectionInner = gloss(View)

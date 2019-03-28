import { gloss, View, ViewProps } from '@o/gloss'
import React, { forwardRef } from 'react'
import { createContextualProps } from './helpers/createContextualProps'
import { SizedSurface } from './SizedSurface'
import { TitleRow, TitleRowProps } from './TitleRow'
import { Omit } from './types'

export type SectionProps = Omit<ViewProps, 'title'> &
  Omit<Partial<TitleRowProps>, 'after' | 'below'> & {
    belowTitle?: React.ReactNode
    afterTitle?: React.ReactNode
    sizePadding?: number
    scrollable?: boolean
    below?: React.ReactNode
    padded?: boolean
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
    sizePadding,
    bordered,
    belowTitle,
    below,
    padding,
    flex,
    icon,
    padded,
    background,
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
      margin={bordered ? 15 : 0}
      noInnerElement
      overflow="hidden"
      flex={flex}
      background={background}
    >
      {!!(title || afterTitle) && (
        <TitleRow
          bordered={bordered}
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
        overflowY={scrollable ? 'auto' : 'hidden'}
        padding={typeof padding !== 'undefined' ? padding : padded ? 20 : 0}
        flex={flex}
        {...viewProps}
      >
        <Reset>{children}</Reset>
      </SectionInner>
      {below}
    </SizedSurface>
  )
})

const SectionInner = gloss(View, {
  overflowX: 'hidden',
})

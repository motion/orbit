import { View, ViewProps } from '@o/gloss'
import React from 'react'
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
  }

const { useProps, Reset, PassProps } = createContextualProps<SectionProps>()
export const SectionPassProps = PassProps
export const useSectionProps = useProps

export function Section(direct: SectionProps) {
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
    ...viewProps
  } = props
  return (
    <SizedSurface
      hoverStyle={null}
      activeStyle={null}
      sizeRadius={bordered ? 1 : 0}
      elevation={bordered ? 1 : 0}
      borderWidth={bordered ? 1 : 0}
      margin={bordered ? 10 : 0}
      noInnerElement
      overflow="hidden"
      flex={flex}
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
        />
      )}
      <View
        overflowY={scrollable ? 'auto' : 'inherit'}
        overflowX="hidden"
        padding={typeof padding !== 'undefined' ? padding : bordered ? 20 : 0}
        {...viewProps}
      >
        <Reset>{children}</Reset>
      </View>
      {below}
    </SizedSurface>
  )
}

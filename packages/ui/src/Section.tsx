import { View, ViewProps } from '@o/gloss';
import React from 'react';
import { SizedSurface } from './SizedSurface';
import { TitleRow, TitleRowProps } from './TitleRow';
import { Omit } from './types';

export type SectionProps = Omit<ViewProps, 'title'> &
  Omit<Partial<TitleRowProps>, 'after' | 'below'> & {
    belowTitle?: React.ReactNode
    afterTitle?: React.ReactNode
    sizePadding?: number
    scrollable?: boolean
    below?: React.ReactNode
  }

export function Section({
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
  ...props
}: SectionProps) {
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
        {...props}
      >
        {children}
      </View>
      {below}
    </SizedSurface>
  )
}

// const SectionChrome = gloss<SectionProps>(View, {
//   position: 'relative',
//   // bordered: {
//   //   margin: 10,
//   //   borderRadius: 8,
//   // },
// }).theme(({ bordered, sizePadding = 1, padding, ...p }, theme) => ({
//   border: bordered ? [1, theme.borderColor] : 'none',

// }))

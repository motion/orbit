import { View, ViewProps } from '@o/gloss'
import React from 'react'
import { SizedSurface } from './SizedSurface'
import { TitleRow, TitleRowProps } from './TitleRow'

export type SectionProps = ViewProps &
  Partial<TitleRowProps> & {
    belowTitle?: React.ReactNode
    sizePadding?: number
    scrollable?: boolean
  }

export function Section({
  above,
  title,
  subTitle,
  scrollable,
  children,
  controls,
  sizePadding,
  bordered,
  belowTitle,
  below,
  ...props
}: SectionProps) {
  return (
    <SizedSurface
      hoverStyle={null}
      activeStyle={null}
      sizeRadius={bordered ? 1 : 0}
      elevation={bordered ? 1 : 0}
      borderWidth={bordered ? 1 : 0}
      padding={bordered ? 20 : 0}
      margin={bordered ? 10 : 0}
      noInnerElement
      overflow="hidden"
    >
      {!!(title || controls) && (
        <TitleRow
          bordered={bordered}
          backgrounded={bordered}
          title={title}
          subTitle={subTitle}
          after={controls}
          above={above}
          below={belowTitle}
        />
      )}
      <View overflowY={scrollable ? 'auto' : 'inherit'} overflowX="hidden" {...props}>
        {children}
      </View>
      {!!below && <div style={{ margin: bordered ? -20 : 0 }}>{below}</div>}
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

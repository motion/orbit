import { gloss, View, ViewProps } from '@o/gloss'
import { selectDefined } from '@o/utils'
import React from 'react'
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
  ...props
}: SectionProps) {
  return (
    <SectionChrome bordered={bordered} sizePadding={sizePadding}>
      {!!(title || controls) && (
        <TitleRow
          bordered={bordered}
          title={title}
          subTitle={subTitle}
          after={controls}
          above={above}
          below={belowTitle}
        />
      )}
      <View overflowY={scrollable ? 'auto' : 'inherit'} {...props}>
        {children}
      </View>
    </SectionChrome>
  )
}

const SectionChrome = gloss<SectionProps>(View, {
  position: 'relative',
  bordered: {
    margin: 10,
    borderRadius: 8,
  },
}).theme(({ bordered, sizePadding = 1, padding, ...p }, theme) => ({
  border: bordered ? [1, theme.borderColor] : 'none',
  paddingTop: selectDefined(p.paddingTop, padding, sizePadding * 15),
  paddingLeft: selectDefined(p.paddingLeft, padding, sizePadding * 15),
  paddingRight: selectDefined(p.paddingRight, padding, sizePadding * 15),
  paddingBottom: selectDefined(p.paddingBottom, padding, sizePadding * 15),
}))

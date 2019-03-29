import { CSSPropertySet, gloss, View as GlossView, ViewProps as GlossViewProps } from '@o/gloss'
import { Elevatable, getElevation } from './elevate'

export type ViewProps = GlossViewProps & Elevatable & Scrollable

// Scrollable

export type Scrollable = {
  scrollable?: boolean | 'x' | 'y'
}

const getScrollable = ({ scrollable }: Scrollable): CSSPropertySet => {
  // easy scrollable
  if (scrollable === true) {
    return { overflowX: 'auto', overflowY: 'auto' }
  } else if (scrollable === 'x') {
    return { overflowX: 'auto', overflowY: 'hidden' }
  } else if (scrollable === 'y') {
    return { overflowY: 'auto', overflowX: 'hidden' }
  }
}

export const View = gloss<ViewProps>(GlossView).theme(getElevation, getScrollable)

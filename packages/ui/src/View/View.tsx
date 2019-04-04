import { Col, ColProps, CSSPropertySet, gloss } from '@o/gloss'
import { ElevatableProps, getElevation } from './elevate'

export type ViewProps = ColProps & ElevatableProps & ScrollableProps

// Scrollable

export type ScrollableProps = {
  scrollable?: boolean | 'x' | 'y'
}

const getScrollable = ({ scrollable }: ScrollableProps): CSSPropertySet => {
  // easy scrollable
  if (scrollable === true) {
    return { overflowX: 'auto', overflowY: 'auto' }
  } else if (scrollable === 'x') {
    return { overflowX: 'auto', overflowY: 'hidden' }
  } else if (scrollable === 'y') {
    return { overflowY: 'auto', overflowX: 'hidden' }
  }
}

export const View = gloss<ViewProps>(Col).theme(getElevation, getScrollable)

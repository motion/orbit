import { Col, ColProps, gloss } from '@o/gloss'
import { getSpaceSize, Sizes } from '../Space'
import { ElevatableProps, getElevation } from './elevate'

export type ViewProps = ColProps & ElevatableProps & PaddedProps

// Padded

export type PaddedProps = {
  pad?: Sizes
  padX?: Sizes
  padY?: Sizes
  padTop?: Sizes
  padBottom?: Sizes
  padLeft?: Sizes
  padRight?: Sizes
}

const padStyle = {
  pad: x => x,
  padX: x => [0, x],
  padY: x => [x, 0],
  padTop: x => [x, 0, 0],
  padBottom: x => [0, 0, x],
  padLeft: x => [0, 0, 0, x],
  padRight: x => [0, x, 0, 0],
}

const getPaddingValue = (props: PaddedProps) => {
  if (props.pad) return padStyle.pad(getSpaceSize(props.pad))
  if (props.padX) return padStyle.padX(getSpaceSize(props.padX))
  if (props.padY) return padStyle.padY(getSpaceSize(props.padY))
  if (props.padTop) return padStyle.padTop(getSpaceSize(props.padTop))
  if (props.padBottom) return padStyle.padBottom(getSpaceSize(props.padBottom))
  if (props.padLeft) return padStyle.padLeft(getSpaceSize(props.padLeft))
  if (props.padRight) return padStyle.padRight(getSpaceSize(props.padRight))
}

const getPadding = (props: PaddedProps) => {
  const padding = getPaddingValue(props)
  console.log('got pad val', padding, props)
  if (typeof padding !== 'undefined') {
    return {
      padding,
    }
  }
}

export const View = gloss<ViewProps>(Col).theme(getPadding, getElevation)

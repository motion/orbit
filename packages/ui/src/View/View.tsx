import { Col, ColProps, gloss } from '@o/gloss'
import { SpacingProps } from '../Space'
import { ElevatableProps, getElevation } from './elevate'

export type ViewProps = ColProps & ElevatableProps & PaddedProps

// Padded

export type PaddedProps = {
  pad?: SpacingProps['spacing']
  padX?: SpacingProps['spacing']
  padY?: SpacingProps['spacing']
  padTop?: SpacingProps['spacing']
  padBottom?: SpacingProps['spacing']
  padLeft?: SpacingProps['spacing']
  padRight?: SpacingProps['spacing']
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

const getPadding = (props: PaddedProps) => {
  if (props.pad) return padStyle.pad(props.pad)
  if (props.padX) return padStyle.padX(props.padX)
  if (props.padY) return padStyle.padY(props.padY)
  if (props.padTop) return padStyle.padTop(props.padTop)
  if (props.padBottom) return padStyle.padBottom(props.padBottom)
  if (props.padLeft) return padStyle.padLeft(props.padLeft)
  if (props.padRight) return padStyle.padRight(props.padRight)
}

export const View = gloss<ViewProps>(Col).theme(getPadding, getElevation)

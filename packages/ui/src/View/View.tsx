import { Col, ColProps, gloss } from '@o/gloss'
import { getSpacing, SpacingProps } from '../Space'
import { ElevatableProps, getElevation } from './elevate'

export type ViewProps = ColProps & ElevatableProps & PaddedProps

// Padded

export type PaddedProps = {
  padded?: SpacingProps['spacing']
}

const getPadding = (props: PaddedProps) => {
  if (typeof props.padded === 'undefined') return
  return {
    padding: getSpacing(props.padded),
  }
}

export const View = gloss<ViewProps>(Col).theme(getPadding, getElevation)

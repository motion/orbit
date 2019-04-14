import { gloss } from '@o/gloss'
import { HTMLProps } from 'react'
import { View, ViewProps } from './View/View'

export type ImageProps = ViewProps & HTMLProps<HTMLImageElement>

export const Image = gloss<ImageProps>(View, {
  display: 'block',
})

Image.defaultProps = {
  tagName: 'img',
}

import * as React from 'react'

declare module 'react' {
  interface HTMLAttributes<T> {
    css?: any
  }

  interface SVGAttributes<T> {
    css?: any
  }

  interface SVGProps<T> {
    css?: any
  }
}

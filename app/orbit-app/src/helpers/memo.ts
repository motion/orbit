import * as React from 'react'
import { cold } from '@mcro/react-hot-loader'

export const memo = <A>(View: A): A => (React.memo(cold(View) as any) as any) as A

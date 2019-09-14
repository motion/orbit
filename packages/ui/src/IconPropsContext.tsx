import { createContext } from 'react'

import { IconProps } from './Icon'

// TODO use createContextProps
export const IconPropsContext = createContext<Partial<IconProps>>(null)

import { createContext, RefObject } from 'react'

// moved to new file to prevent circular import bug
export const ScrollableRefContext = createContext<RefObject<HTMLElement>>(null)

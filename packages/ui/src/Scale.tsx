import { createContextualProps } from './helpers/createContextualProps'

const scaleContext = createContextualProps({
  size: 1,
})

export const Scale = scaleContext.PassProps
export const ScaleReset = scaleContext.Reset
export const useScale = () => {
  const context = scaleContext.useProps()
  return context ? context.size : 1
}

export const ScaleContext = scaleContext.Context

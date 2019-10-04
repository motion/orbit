import { createContextualProps } from './helpers/createContextualProps'
import { SizedSurfaceProps } from './SizedSurface'

// TODO this is using SizedSurfaceProps, needs some work to separate the two
export const SizedSurfacePropsContext = createContextualProps<SizedSurfaceProps>()
export const SurfacePassPropsReset = SizedSurfacePropsContext.Reset
export const SurfacePassProps = SizedSurfacePropsContext.PassProps
export const useSurfaceProps = SizedSurfacePropsContext.useProps

import { createContextualProps } from './helpers/createContextualProps'
import { SurfaceProps } from './Surface'

// TODO this is using SizedSurfaceProps, needs some work to separate the two
export const SizedSurfacePropsContext = createContextualProps<SurfaceProps>()
export const SurfacePassPropsReset = SizedSurfacePropsContext.Reset
export const SurfacePassProps = SizedSurfacePropsContext.PassProps
export const useSurfaceProps = SizedSurfacePropsContext.useProps

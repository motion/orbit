import { AppBit, Bit } from '@o/models'
import { AppDefinition, AppViewProps } from '@o/orbit-types'

export { AppDefinition } from '@o/orbit-types'

export type AppBitMainProps = { item: Bit }

export type AppSettingsProps<T extends AppBit> = {
  appProps?: AppViewProps
  app: T
}

export type LazyAppDefinition = () => Promise<{ default: AppDefinition }>

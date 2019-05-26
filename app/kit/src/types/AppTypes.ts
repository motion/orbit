import { AppBit, AppDefinition, AppViewProps, Bit } from '@o/models'

export type AppBitMainProps = { item: Bit }

export type AppSettingsProps<T extends AppBit> = {
  appProps?: AppViewProps
  app: T
}

export type LazyAppDefinition = () => Promise<{ default: AppDefinition }>

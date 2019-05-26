export type AppViewProps<A = any> = {
  identifier?: string
  id?: string
  subId?: string
  title?: string
  subTitle?: string
  data?: A
  icon?: string
  iconLight?: string
  subType?: string
  viewType?: 'main' | 'index' | 'setup' | 'settings'
}

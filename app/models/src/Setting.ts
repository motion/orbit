export type Setting = {
  target: 'setting'
  id?: number
  name?: string
  values?: {
    hasOnboarded?: boolean
    autoUpdate?: boolean
    autoLaunch?: boolean
    darkTheme?: boolean
    realtimeSearch?: boolean
    openShortcut?: string
    cosalIndexUpdatedTo: number
    topTopics: string[]
    recentSearches?: string[]
    pinnedBits?: string[]
  }
}

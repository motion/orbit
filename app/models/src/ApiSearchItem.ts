export type ApiSearchItem = {
  name: string
  identifier: string
  packageId: string
  description: string
  features: ('graph' | 'app' | 'api' | 'sync' | 'workers')[]
  icon: string
  search: string[]
  installs: number
  setup: Object
  author: string
}

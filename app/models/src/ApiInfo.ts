export type ApiArgType = {
  name: string
  type: string
  isOptional: boolean
}

export type ApiType = {
  name: string
  args: ApiArgType[]
  typeString: string
  comment: string
}

export type ApiInfo = {
  [key: string]: ApiType
}

export type ApiSearchItem = {
  name: string
  identifier: string
  packageId: string
  description: string
  features: ('graph' | 'app' | 'api' | 'sync' | 'workers' | 'auth')[]
  icon: string
  search: string[]
  installs: number
  setup: Object
  author: string
}

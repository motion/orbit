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

export type ApiType = {
  name: string
  args: { name: string; type: string; isOptional: boolean }[]
  typeString: string
  comment: string
}

export type ApiInfo = { [key: string]: ApiType }

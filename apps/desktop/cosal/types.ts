export type Doc {
  id: string
  fields: Array<{ weight: number; content: string }>
  createdAt: number
}

export type Cosal {
  id: string
  fields: Array<{ weight: number; content: string; words: Array<any> }>
  vector: Array<number>
  createdAt: number
}

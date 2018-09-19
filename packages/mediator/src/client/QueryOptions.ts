export type QueryOptions<ModelType> = {
  [P in keyof ModelType]?: ModelType[P] extends Array<infer U>
    ? QueryOptions<U>
    : ModelType[P] extends ReadonlyArray<infer U>
      ? QueryOptions<U>
      : ModelType[P] extends object ? QueryOptions<ModelType[P]> : boolean
}

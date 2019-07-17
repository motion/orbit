export type SaveOptions<ModelType> = {
  [P in keyof ModelType]?: ModelType[P] extends (infer U)[]
    ? SaveOptions<U>[]
    : ModelType[P] extends ReadonlyArray<infer U>
    ? ReadonlyArray<SaveOptions<U>>
    : SaveOptions<ModelType[P]>
  // ModelType[P] extends Array<string | number | boolean> ? ModelType[P] :
  // ModelType[P] extends Array<infer U> ? SaveOptions<U> :
  // ModelType[P] extends ReadonlyArray<infer U> ? SaveOptions<U> :
  // ModelType[P] extends object ?  SaveOptions<ModelType[P]> :
  // ModelType[P]
}

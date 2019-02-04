export type GenericComponent<T> = React.ComponentClass<T> | React.SFC<T>

export type ContextValueOf<S> = S extends React.Context<infer T> ? T : never

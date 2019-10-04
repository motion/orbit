import React, { createContext, useContext, useMemo } from 'react'

export type ContextualProps<A> = {
  Context: React.Context<Partial<A>>
  PassProps: ({
    children,
    ...rest
  }: Partial<Pick<A, Exclude<keyof A, 'children'>> & { children?: any }>) => JSX.Element
  useProps<B extends Partial<A>>(componentProps?: B): B extends undefined ? A : B & A
  Reset(props: { children: any }): any
  useReset<A>(children: A): A
}

export function createContextualProps<A extends any>(defaults?: A): ContextualProps<A> {
  const Context = createContext<Partial<A> | null>(null)
  const PassProps = ({ children, ...rest }: Partial<Omit<A, 'children'> & { children?: any }>) => {
    const parentProps = useContext(Context)
    const val = { ...defaults, ...parentProps, ...rest }
    const memoVal = useMemo(
      () => val,
      // memo based on values
      [...Object.keys(val).map(k => val[k])],
    )
    return <Context.Provider value={memoVal}>{children}</Context.Provider>
  }
  const useReset = (children: any) => {
    const extraProps = useContext(Context)
    if (extraProps) {
      return <Context.Provider value={null}>{children}</Context.Provider>
    }
    return children
  }
  return {
    Context,
    PassProps,
    useProps<B extends Partial<A> | undefined>(
      componentProps?: B,
    ): B extends undefined ? A : B & A {
      const extra = useContext(Context)
      return useMemo(() => {
        if (!extra) {
          return componentProps as any
        }
        if (!componentProps) {
          return extra
        }
        // merge just undefined componentProps from extra
        const final: any = { ...componentProps }
        for (const key in extra) {
          if (final[key] === undefined) {
            final[key] = extra[key]
          }
        }
        return final as any
      }, [extra, componentProps])
    },
    Reset({ children }) {
      return useReset(children)
    },
    useReset,
  }
}

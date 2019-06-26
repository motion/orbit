import React, { createContext, useContext, useMemo } from 'react'

export type ContextualProps<A> = {
  Context: React.Context<Partial<A>>
  PassProps: ({
    children,
    ...rest
  }: Partial<Pick<A, Exclude<keyof A, 'children'>> & { children?: any }>) => JSX.Element
  useProps<B extends Partial<A>>(componentProps?: B): B extends undefined ? A : B & A
  Reset(props: { children: any }): any
}

export function createContextualProps<A extends any>(defaults?: A): ContextualProps<A> {
  const Context = createContext<Partial<A> | null>(null)
  const PassProps = ({ children, ...rest }: Partial<Omit<A, 'children'> & { children?: any }>) => {
    const parentProps = useContext(Context)
    const memoVal = useMemo(() => {
      return { ...defaults, ...parentProps, ...rest }
    }, [parentProps, rest])
    // @ts-ignore
    return <Context.Provider value={memoVal}>{children}</Context.Provider>
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
        // merge just undefined componentProps from extra
        const final: any = { ...componentProps }
        for (const key in extra) {
          if (typeof final[key] === 'undefined') {
            final[key] = extra[key]
          }
        }
        return final as any
      }, [extra, componentProps])
    },
    Reset({ children }: { children: any }) {
      const extraProps = useContext(Context)
      if (!extraProps) {
        return children
      }
      return <Context.Provider value={null}>{children}</Context.Provider>
    },
  }
}

import { useMemo, useRef } from 'react'

// common performance utility

// lets you write things that would normally de-opt an entire react tree
// because they pass a new function every render:
//   <List onSomething={() => {}} />
// and will memo every one for the next component down the tree, without being stale

// how it does it:
// for all props that have functions
// memo every function so it doesnt change every render to the component below,
// but inside the memo'd fn, it references a "useRef" to the latest version of the function

export function usePropsWithMemoFunctions<A extends Object>(props: A): A {
  const fnRefs = useRef<any>({})
  const fnMemos = useRef<any>({})

  return useMemo(
    () => {
      const finalProps = { ...props }

      for (const key in props) {
        const val = props[key]
        if (typeof val === 'function') {
          fnRefs.current[key] = val
          if (fnMemos.current[key]) {
            props[key] = fnMemos.current[key]
          } else {
            fnMemos.current[key] = (...args: any[]) => {
              return fnRefs.current[key](...args)
            }
          }
        }
      }

      return finalProps
    },
    [props],
  )
}

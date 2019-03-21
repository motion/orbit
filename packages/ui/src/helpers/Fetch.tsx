import React, { Suspense } from 'react'
import { useFetch, UseFetchOptions } from '../hooks/useFetch'
import { Loading } from '../progress/Loading'

export type FetchProps = Partial<UseFetchOptions> & {
  url: RequestInfo
  children?: (response: any) => React.ReactNode
  fallback?: React.ReactNode
}

export function Fetch(props: FetchProps) {
  return (
    <Suspense fallback={<Loading />}>
      <RunFetch {...props} />
    </Suspense>
  )
}

function RunFetch({ url, children, ...options }: FetchProps) {
  const res = useFetch(url, { lifespan: 0, ...options })
  if (!children) {
    console.warn(url, options, children)
    return null
  }
  return <>{children(res)}</>
}

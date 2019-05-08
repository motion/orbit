import { RefObject, useRef } from 'react'

export type UseNodeProps<A> = {
  ref?: RefObject<A>
  map: (node: A) => HTMLElement
}

const idFn = _ => _

export function useNode<A extends HTMLElement>(props: UseNodeProps<A> = { map: idFn }) {
  const internalRef = useRef(null)
  const ref = props.ref || internalRef
  const mapRef = useRef(null)

  if (ref.current) {
    mapRef.current = props.map(ref.current)
  }

  return {
    current: mapRef.current,
    ref,
  }
}
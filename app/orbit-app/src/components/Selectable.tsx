import { useResults } from '../hooks/useResults'

export function Selectable(props: { items: any[]; children?: any }) {
  useResults(props.items)
  return props.children
}

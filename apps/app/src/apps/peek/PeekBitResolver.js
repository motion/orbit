import { BitResolver } from '../../components/BitResolver'

export const PeekBitResolver = ({ bit, ...props }) => {
  return <BitResolver bit={bit} shownLimit={Infinity} isExpanded {...props} />
}

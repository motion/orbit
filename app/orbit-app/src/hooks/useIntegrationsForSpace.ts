import { useObserveMany } from '@mcro/model-bridge'
import { SourceModel } from '@mcro/models'

export function useIntegrationsForSpace(props: { spaceId: number } | false) {
  return useObserveMany(SourceModel, props && { where: { spaces: { $in: [props.spaceId] } } })
}

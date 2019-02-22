import { useModels } from '@mcro/bridge'
import { SourceModel } from '@mcro/models'

export function useSourcesForSpace(props: { spaceId: number } | false) {
  return useModels(SourceModel, props && { where: { spaces: { $in: [props.spaceId] } } })[0]
}

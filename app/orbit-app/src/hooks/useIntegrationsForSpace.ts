import { useModels } from '../useModel'
import { SourceModel } from '@mcro/models'

export function useIntegrationsForSpace(props: { spaceId: number } | false) {
  return useModels(SourceModel, props && { where: { spaces: { $in: [props.spaceId] } } })[0]
}

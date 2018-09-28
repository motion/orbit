import { ItemResolverProps } from '../ItemResolver'
import { Setting } from '@mcro/models'
import { NICE_INTEGRATION_NAMES } from '../../constants'

export const ResolveApp = ({ model, children }: ItemResolverProps<Setting>) =>
  children({
    id: `${model.id}`,
    type: 'app',
    title: NICE_INTEGRATION_NAMES[model.type],
    icon: model.type,
  })

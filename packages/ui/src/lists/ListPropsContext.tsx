import { createContextualProps } from '../helpers/createContextualProps'
import { ListProps } from './List'

export const PropsContext = createContextualProps<ListProps>()
export const ListPassProps = PropsContext.PassProps
export const useListProps = PropsContext.useProps

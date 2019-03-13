import { useModel } from '@o/bridge';
import { AppModel } from '@o/models';

export function useApp(id: number) {
  return useModel(AppModel, { where: { id } })
}

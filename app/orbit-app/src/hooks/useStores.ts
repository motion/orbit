import { createUseStores } from '@mcro/use-store';
import { StoreContext } from '../contexts';
import { AllStores } from '../contexts/StoreContext';

type GuaranteedAllStores = { [P in keyof AllStores]-?: AllStores[P] }

export const useStores = createUseStores(StoreContext as React.Context<GuaranteedAllStores>)

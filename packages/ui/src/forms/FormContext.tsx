import { createStoreContext } from '@o/use-store'

import { FormStore } from './FormStore'

export const FormContext = createStoreContext(FormStore)
export const useCreateForm = FormContext.useCreateStore
export const useParentForm = FormContext.useStore

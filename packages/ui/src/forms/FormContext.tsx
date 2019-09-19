import { createStoreContext } from '@o/use-store'

import { FormStore } from './Form'

export const FormContext = createStoreContext(FormStore)
export const useCreateForm = FormContext.useCreateStore
export const useParentForm = FormContext.useStore

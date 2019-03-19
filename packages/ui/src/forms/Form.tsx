import React, { createContext, Dispatch, useReducer } from 'react'
import { MergeContext } from '../helpers/MergeContext'

export type FormProps = { children?: React.ReactNode }
export type FieldState = {}

type FormActions =
  | { type: 'addField'; value: FieldState }
  | { type: 'removeField'; value: FieldState }

type FormState = {
  fields: Set<FieldState>
}

const FormContext = createContext<FormState & { dispatch: Dispatch<FormActions> } | null>(null)

function fieldsReducer(state: FormState, action: FormActions) {
  switch (action.type) {
    case 'addField':
      state.fields.add(action.value)
      return state
    case 'removeField':
      state.fields.delete(action.value)
      return state
  }
  return state
}

export function Form(props: FormProps) {
  const [state, dispatch] = useReducer(fieldsReducer, { fields: new Set() })

  return (
    <MergeContext Context={FormContext} value={{ dispatch, state }}>
      {props.children}
    </MergeContext>
  )
}

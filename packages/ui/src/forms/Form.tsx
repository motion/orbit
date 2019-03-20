import React, { createContext, Dispatch, useContext, useReducer } from 'react';
import { MergeContext } from '../helpers/MergeContext';
import { TableFilter } from '../tables/types';
import { InputType } from './Input';

export type FormProps = { children?: React.ReactNode }
export type FieldState = {
  name: string
  type: InputType
  value: any
}

type FormActions =
  | { type: 'changeField'; value: FieldState }
  | { type: 'removeField'; value: string }

type FormState = {
  fields: { [key: string]: FieldState }
}

export const FormContext = createContext<FormState & { dispatch: Dispatch<FormActions> } | null>(
  null,
)

function fieldsReducer(state: FormState, action: FormActions) {
  switch (action.type) {
    case 'changeField':
      state.fields = {
        ...state.fields,
        [action.value.name]: action.value,
      }
      return state
    case 'removeField':
      delete state.fields[action.value]
      return state
  }
  return state
}

export function Form(props: FormProps) {
  const [state, dispatch] = useReducer(fieldsReducer, { fields: {} })

  return (
    <MergeContext Context={FormContext} value={{ dispatch, state }}>
      {props.children}
    </MergeContext>
  )
}

export function useFormValue(name: string) {
  const context = useContext(FormContext)
  if (!context) return null
  return context.fields[name].value
}

export function useFormFilters(names: string[]): TableFilter[] {
  const context = useContext(FormContext)
  if (!context) return null
  const fields = Object.keys(context.fields)
    .filter(x => names.some(y => y === x))
    .map(key => context.fields[key])
  console.log('got fields', fields)
  return []
}

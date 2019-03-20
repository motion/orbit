import React, { createContext, Dispatch, useContext, useReducer } from 'react'
import { MergeContext } from '../helpers/MergeContext'
import { TableFilter } from '../tables/types'
import { InputType } from './Input'

export type FormProps = {
  children?: React.ReactNode
  use?: UseForm
}

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

type FormContextType = FormState & { dispatch: Dispatch<FormActions> } | null

export const FormContext = createContext<FormContextType>(null)

function fieldsReducer(state: FormState, action: FormActions) {
  switch (action.type) {
    case 'changeField':
      state.fields = {
        ...state.fields,
        [action.value.name]: action.value,
      }
      return { ...state }
    case 'removeField':
      delete state.fields[action.value]
      return { ...state }
  }
}

export function Form(props: FormProps) {
  const [state, dispatch] = useReducer(fieldsReducer, { fields: {} })
  return (
    <MergeContext
      Context={FormContext}
      value={props.use ? props.use.context : { dispatch, ...state }}
    >
      {props.children}
    </MergeContext>
  )
}

function getFormValue(context: FormContextType, name: string) {
  if (context.fields[name]) {
    return context.fields[name].value
  }
}

export function useFormValue(name: string) {
  const context = useContext(FormContext)
  if (!context) return null
  return getFormValue(context, name)
}

function getFormFilters(context: FormContextType, names: string[]): TableFilter[] {
  const fields = Object.keys(context.fields)
    .filter(x => names.some(y => y === x))
    .map(key => context.fields[key])
  console.log('got fields', fields)
  return []
}

export function useFormFilters(names: string[]): TableFilter[] {
  const context = useContext(FormContext)
  if (!context) return null
  return getFormFilters(context, names)
}

export type UseForm = {
  context: FormContextType
  getValue: (name: string) => any
  getFilters: (names: string[]) => TableFilter[]
}

export function useForm(): UseForm {
  const [state, dispatch] = useReducer(fieldsReducer, { fields: {} })
  const context = { ...state, dispatch }
  return {
    context,
    getValue: a => getFormValue(context, a),
    getFilters: b => getFormFilters(context, b),
  }
}

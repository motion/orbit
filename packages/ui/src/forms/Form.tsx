import produce from 'immer'
import { flatten } from 'lodash'
import React, { createContext, Dispatch, useContext, useReducer } from 'react'
import { MergeContext } from '../helpers/MergeContext'
import { Section, SectionProps } from '../Section'
import { SurfacePassProps } from '../Surface'
import { TableFilter, TableFilterIncludeExclude } from '../tables/types'
import { InputType } from './Input'

export type FormProps = SectionProps & {
  children?: React.ReactNode
  use?: UseForm
  size?: number
}

export type FieldState =
  | {
      name: string
      type: InputType
      value: any
    }
  | {
      name: string
      type: 'select'
      value: { label: string; value: string }[]
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
      return produce(state, next => {
        next.fields[action.value.name] = action.value
      })
    case 'removeField':
      return produce(state, next => {
        delete next.fields[action.value]
      })
  }
}

export function Form({ children, use, size = 1.2, ...sectionProps }: FormProps) {
  const [state, dispatch] = useReducer(fieldsReducer, { fields: {} })
  return (
    <MergeContext Context={FormContext} value={use ? use.context : { dispatch, ...state }}>
      <Section {...sectionProps}>
        <SurfacePassProps size={size}>{children}</SurfacePassProps>
      </Section>
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

function createIncludeFilter(label: string, value: any): TableFilterIncludeExclude {
  return {
    value,
    type: 'include',
    key: label,
  }
}

function getFormFilters(context: FormContextType, names: string[]): TableFilter[] {
  const fields = Object.keys(context.fields)
    .filter(x => names.some(y => y === x))
    .map(key => context.fields[key])
  const selectFields = flatten(
    fields
      .filter(x => x.type === 'select')
      // can have multiple values
      .map(x =>
        Array.isArray(x.value)
          ? x.value.map(y => createIncludeFilter(x.name, y.value))
          : createIncludeFilter(x.name, x.value.value),
      ),
  )
  return selectFields
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

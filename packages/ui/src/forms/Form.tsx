import produce from 'immer'
import { flatten } from 'lodash'
import React, {
  createContext,
  Dispatch,
  forwardRef,
  HTMLProps,
  useCallback,
  useContext,
  useEffect,
  useReducer,
} from 'react'
import { Button } from '../buttons/Button'
import { MergeContext } from '../helpers/MergeContext'
import { useGet } from '../hooks/useGet'
import { Section, SectionProps } from '../Section'
import { Space } from '../Space'
import { TableFilter, TableFilterIncludeExclude } from '../tables/types'
import { Message } from '../text/Message'
import { FormField } from './FormField'
import { InputType } from './Input'

export type FormProps<A extends FormFieldsObj> = SectionProps &
  Pick<HTMLProps<HTMLFormElement>, 'action' | 'method' | 'target' | 'name'> & {
    submitButton?: string | boolean
    fields?: A
    errors?: FormErrors<any>
    onSubmit?: (
      e: React.FormEvent<HTMLFormElement>,
      values: FormValues,
    ) => FormErrors<A> | Promise<FormErrors<A>>
    children?: React.ReactNode
    use?: UseForm
    size?: number
  }

type FormValues = { [key in keyof FormFieldsObj]: any }
export type FormFieldsObj = { [key: string]: FormField }
export type FormErrors<A> = { [key in keyof A]: string } | string | null | true | undefined | void

type FormField =
  | {
      name: string
      type?: InputType | string
      value?: any
      required?: boolean
      validate?: (val: any) => string
    }
  | {
      name: string
      type: 'select'
      value: { label: string; value: string }[]
      required?: boolean
      validate?: (val: any) => string
    }

type FormActions =
  | { type: 'changeField'; value: FormField }
  | { type: 'removeField'; value: string }
  | { type: 'setErrors'; value: FormErrors<any> }
  | { type: 'setFields'; value: FormFieldsObj }

type FormState = {
  errors: FormErrors<any>
  values: FormFieldsObj
  globalError?: string
}

type FormContext = FormState & { dispatch: Dispatch<FormActions> } | null

export const FormContext = createContext<FormContext>(null)

function fieldsReducer(state: FormState, action: FormActions) {
  switch (action.type) {
    case 'setErrors':
      return produce(state, next => {
        next.globalError = null
        if (action.value === true) {
          next.errors = null
        } else if (typeof action.value === 'string') {
          next.globalError = action.value
        } else if (action.value && Object.keys(action.value).length) {
          next.errors = action.value
        } else {
          next.errors = null
        }
      })
    case 'setFields':
      return produce(state, next => {
        next.values = action.value
      })
    case 'changeField':
      if (state.values) {
        // dont trigger update on every keystroke
        // return produce(state, next => {
        // })
        state.values[action.value.name] = action.value
      }
      return state
    case 'removeField':
      return produce(state, next => {
        delete next.values[action.value]
      })
  }
}

export const Form = forwardRef<HTMLFormElement, FormProps<FormFieldsObj>>(function Form(
  {
    children,
    use,
    onSubmit,
    errors,
    fields,
    submitButton,
    action,
    method,
    target,
    name,
    ...sectionProps
  },
  ref,
) {
  const [state, dispatch] = useReducer(fieldsReducer, { values: fields, errors: errors || null })
  const getState = useGet(state)

  if (fields && children) {
    throw new Error(
      `Can't pass both fields and children, Form accepts one or the other. See docs: `,
    )
  }

  useEffect(() => {
    if (!!errors) {
      dispatch({ type: 'setErrors', value: errors })
    }
  }, [errors])

  useEffect(() => {
    if (typeof fields !== 'undefined') {
      dispatch({ type: 'setFields', value: fields })
    }
  }, [fields])

  let elements = children

  if (fields) {
    elements = generateFields(fields)
  }

  const onSubmitInner = useCallback(
    async e => {
      const curState = getState()
      e.preventDefault()
      if (onSubmit) {
        // first do any field validation
        let fieldErrors = {}
        for (const key in curState.values) {
          const field = curState.values[key]
          if (field.required && !field.value) {
            fieldErrors[name] = 'is required.'
            continue
          }
          if (typeof field.validate === 'function') {
            const err = field.validate(field.value)
            if (err) {
              fieldErrors[name] = err
            }
            continue
          }
        }
        if (Object.keys(fieldErrors).length) {
          dispatch({ type: 'setErrors', value: fieldErrors })
          return
        }

        // then submit and check validation
        let nextErrors = onSubmit(e, curState.values)
        if (nextErrors instanceof Promise) {
          nextErrors = await nextErrors
        }
        dispatch({ type: 'setErrors', value: nextErrors })
      }
    },
    [getState, onSubmit],
  )

  const contextValue = use ? use.context : { dispatch, ...state }

  return (
    <form
      ref={ref}
      style={{ display: 'contents' }}
      onSubmit={onSubmitInner}
      {...{ action, method, target, name }}
    >
      <MergeContext Context={FormContext} value={contextValue}>
        <Section background="transparent" flex={1} {...sectionProps}>
          {state.globalError && (
            <>
              <Message alt="error">{state.globalError}</Message>
              <Space />
            </>
          )}
          {state.errors && (
            <>
              <Message alt="warn">Form has errors, please check.</Message>
              <Space />
            </>
          )}

          {elements}

          {!!submitButton && (
            <>
              <Space />
              <FormField label="">
                <Button alignSelf="flex-end" size="lg" type="submit" alt="action">
                  {submitButton === true ? 'Submit' : submitButton}
                </Button>
              </FormField>
            </>
          )}
        </Section>
      </MergeContext>
    </form>
  )
})

function generateFields(fields: FormFieldsObj): React.ReactNode {
  return Object.keys(fields).map(key => {
    const field = fields[key]
    return (
      <FormField
        key={key}
        label={field.name}
        name={key}
        // TODO type
        type={(field.type || 'string') as any}
        defaultValue={field.value}
      />
    )
  })
}

function getFormValue(context: FormContext, name: string) {
  if (context.values[name]) {
    return context.values[name].value
  }
}

export function useFormError(name: string) {
  const context = useContext(FormContext)
  if (!context) return null
  return context.errors && context.errors[name]
}

function createIncludeFilter(label: string, value: any): TableFilterIncludeExclude {
  return {
    value,
    type: 'include',
    key: label,
  }
}

function getFormFilters(context: FormContext, names: string[]): TableFilter[] {
  const fields = Object.keys(context.values)
    .filter(x => names.some(y => y === x))
    .map(key => context.values[key])
  const selectFields = flatten(
    fields
      .filter(x => x.type === 'select')
      // can have multiple values
      .map(x =>
        Array.isArray(x.value)
          ? x.value.map(y => createIncludeFilter(x.name, y.value))
          : x.value
          ? createIncludeFilter(x.name, x.value.value)
          : null,
      ),
  ).filter(Boolean)
  return selectFields
}

export function useFormFilters(names: string[]): TableFilter[] {
  const context = useContext(FormContext)
  if (!context) return null
  return getFormFilters(context, names)
}

export type UseForm = {
  context: FormContext
  getValue: (name: string) => any
  getFilters: (names: string[]) => TableFilter[]
}

export function useForm(): UseForm {
  const [state, dispatch] = useReducer(fieldsReducer, { values: {}, errors: null })
  const context = { ...state, dispatch }
  return {
    context,
    getValue: a => getFormValue(context, a),
    getFilters: b => getFormFilters(context, b),
  }
}

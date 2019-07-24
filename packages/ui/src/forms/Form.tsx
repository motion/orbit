import { createStoreContext, shallow, useStore } from '@o/use-store'
import { flatten } from 'lodash'
import React, { forwardRef, HTMLProps, useCallback } from 'react'

import { Button } from '../buttons/Button'
import { ErrorMessage } from '../ErrorMessage'
import { Section, SectionProps } from '../Section'
import { Space } from '../Space'
import { TableFilterIncludeExclude } from '../tables/types'
import { Message } from '../text/Message'
import { DataType } from '../types'
import { FormField } from './FormField'
import { InputType } from './Input'

export type FormProps<A extends FormFieldsObj> = Omit<SectionProps, 'children'> &
  Pick<HTMLProps<HTMLFormElement>, 'action' | 'method' | 'target' | 'name'> & {
    submitButton?: string | boolean
    fields?: A
    errors?: FormErrors<any>
    onSubmit?: (
      e: React.FormEvent<HTMLFormElement>,
      values: FormValues,
    ) => FormErrors<A> | Promise<FormErrors<A>>
    children?: React.ReactNode
    useForm?: FormStore
    size?: number
  }

type FormValues = { [key in keyof FormFieldsObj]: any }
export type FormFieldsObj = { [key: string]: FormFieldType }

/**
 * Used to describe if any errors exist on the form.
 * If falsy, no problem, if truthful, shows an error.
 * Maps to fields.
 * */
export type FormErrors<A> = { [key in keyof A]: string } | string | null | true | void

type FormFieldType =
  | {
      name: string
      type?: InputType
      value?: any
      required?: boolean
      description?: string
      validate?: (val: any) => string
    }
  | {
      name: string
      type: 'select'
      value: { label: string; value: string }[]
      required?: boolean
      description?: string
      validate?: (val: any) => string
    }
  | {
      name: string
      type: 'custom'
      children: React.ReactNode
      value?: any
      required?: boolean
      validate?: (val: any) => string
    }

export type FormStoreProps = Pick<FormProps<FormFieldsObj>, 'fields' | 'errors'>

class FormStore {
  props: FormStoreProps
  globalError: string = ''
  values: FormFieldsObj = shallow({})
  errors: FormErrors<any> = null
  mountKey = 0

  setErrors(value: FormErrors<any>) {
    this.globalError = null
    if (value === true) {
      this.errors = null
    } else if (typeof value === 'string') {
      this.globalError = value
    } else if (value && Object.keys(value).length) {
      // handle a general object describing a global error
      if (value.type === 'error' && typeof value.message === 'string') {
        this.globalError = value.message
      }
      this.errors = value
    } else {
      this.errors = null
    }
  }

  setFields(value: FormFieldsObj) {
    this.values = value
  }

  changeField(next: FormFieldType) {
    // mount
    if (this.values[next.name] === undefined) {
      this.mountKey++
    }
    if (this.values) {
      this.values[next.name] = next
    }
  }

  removeField(name: string) {
    delete this.values[name]
  }

  getValue(name: string) {
    if (!this.values[name]) {
      this.values[name] = { value: null, name }
    }
    return this.values[name].value
  }

  getFilters(names: string[]) {
    // re-read on new mounts
    this.mountKey
    const fields = Object.keys(this.values)
      .filter(x => names.some(y => y === x))
      .map(key => this.values[key])
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
}

const FormContext = createStoreContext(FormStore)
export const useCreateForm = FormContext.useCreateStore
export const useParentForm = FormContext.useStore

export const Form = forwardRef<HTMLFormElement, FormProps<FormFieldsObj>>(function Form(
  {
    children,
    useForm: parentUseForm,
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
  const formStore = parentUseForm ? useStore(parentUseForm) : useCreateForm({ fields, errors })
  const finalFields = formStore.props ? formStore.props.fields : undefined

  if (finalFields && children) {
    return (
      <ErrorMessage
        message={`Can't pass both fields and children, Form accepts one or the other.`}
      />
    )
  }

  let elements = children

  if (finalFields) {
    elements = generateFields(finalFields)
  }

  const onSubmitInner = useCallback(
    async e => {
      e.preventDefault()
      if (onSubmit) {
        // collect errors
        let fieldErrors = {}
        // extract flat values here for callback
        const values = {}

        // validate
        for (const key in formStore.values) {
          const field = formStore.values[key]

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

          // set final value to callback
          values[field.name] = field.value
        }

        if (Object.keys(fieldErrors).length) {
          formStore.setErrors(fieldErrors)
          return
        }

        // then submit and check validation
        let nextErrors = onSubmit(e, values)
        if (nextErrors instanceof Promise) {
          nextErrors = await nextErrors
        }

        formStore.setErrors(nextErrors)
      }
    },
    [onSubmit],
  )

  return (
    <form
      ref={ref}
      style={{ display: 'contents' }}
      onSubmit={onSubmitInner}
      {...{ action, method, target, name }}
    >
      <FormContext.SimpleProvider value={formStore}>
        <Section background="transparent" flex={1} {...sectionProps}>
          {formStore.globalError && (
            <>
              <Message alt="error">{formStore.globalError}</Message>
              <Space />
            </>
          )}

          {!!formStore.errors && (
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
      </FormContext.SimpleProvider>
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
        type={DataType[field.type]}
        defaultValue={field.value}
        description={'description' in field ? field.description : undefined}
        {...field.type === 'custom' && { children: field.children }}
      />
    )
  })
}

export function useFormError(name: string) {
  const formStore = useParentForm()
  if (!formStore) return null
  return formStore.errors && formStore.errors[name]
}

function createIncludeFilter(label: string, value: any): TableFilterIncludeExclude {
  return {
    value,
    type: 'include',
    key: label,
  }
}

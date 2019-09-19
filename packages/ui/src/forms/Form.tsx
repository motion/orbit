import { isEqual } from '@o/fast-compare'
import { ensure, react, shallow, useReaction, useStore } from '@o/use-store'
import { selectDefined } from '@o/utils'
import React, { HTMLProps, Ref, useCallback } from 'react'

import { Button } from '../buttons/Button'
import { Section, SectionProps } from '../Section'
import { Space } from '../Space'
import { TableFilterIncludeExclude } from '../tables/types'
import { Message } from '../text/Message'
import { DataType } from '../types'
import { FormContext, useCreateForm, useParentForm } from './FormContext'
import { FormField } from './FormField'
import { InputType } from './Input'

export type FormProps<A extends FormFieldsObj> = Omit<SectionProps, 'children' | 'nodeRef'> &
  Pick<HTMLProps<HTMLFormElement>, 'action' | 'method' | 'target' | 'name'> & {
    nodeRef?: Ref<HTMLFormElement>
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
      label: string
      type?: InputType
      value?: any
      required?: boolean
      description?: string
      validate?: (val: any) => string
    }
  | {
      label: string
      type: 'select'
      value: { label: string; value: string }[]
      required?: boolean
      description?: string
      validate?: (val: any) => string
    }
  | {
      label: string
      type: 'custom'
      children: React.ReactNode
      value?: any
      required?: boolean
      validate?: (val: any) => string
    }

export type FormStoreProps = Pick<FormProps<FormFieldsObj>, 'fields' | 'errors'>

export class FormStore {
  // @ts-ignore
  props: FormStoreProps
  globalError: string = ''
  hasEdited = {}
  simpleValues = {}
  values: FormFieldsObj = shallow({})
  derivedValues = shallow({})
  errors: FormErrors<any> = null
  mountKey = 0

  get fields() {
    return this.props ? this.props.fields : {}
  }

  lastPropValues = {}
  updateValuesFromProps = react(
    () => this.fields,
    fields => {
      ensure('fields', !!fields)
      for (const key in fields) {
        // default to string
        const fieldValue = selectDefined(fields[key].value, '')
        // only update if the value changes
        if (fieldValue !== this.lastPropValues[key]) {
          // dont worry about updating after weve edited a derived field
          if (typeof fieldValue === 'function' && this.hasEdited[key]) {
            continue
          }
          this.lastPropValues[key] = fieldValue
          this.changeValue(key, fields[key])
        }
      }
    },
  )

  updateDerivedValues = react(
    () => [this.fields, this.simpleValues],
    () => {
      const { fields, simpleValues } = this
      for (const key in fields) {
        const simpleValue = simpleValues[key]
        const field = fields[key]
        let next: any
        if (typeof field.value === 'function' && !this.hasEdited[key]) {
          next = field.value(simpleValues)
        } else {
          next = simpleValue
        }
        if (next !== this.derivedValues[key]) {
          this.derivedValues[key] = next
        }
      }
    },
  )

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

  changeValue = (key: string, next: Partial<FormFieldType>, isDirectEdit = false) => {
    if (isDirectEdit) {
      this.hasEdited[key] = true
    }
    // mount
    if (this.values[key] === undefined) {
      this.mountKey++
    }
    if (this.values && !isEqual(next.value, this.simpleValues[key])) {
      this.values[key] = { ...this.values[key], ...next } as any
      const nextValue =
        typeof next.value === 'function'
          ? next.value(this.simpleValues)
          : selectDefined(next.value, '')
      this.simpleValues = {
        ...this.simpleValues,
        [key]: nextValue,
      }
    }
  }

  removeField(name: string) {
    delete this.values[name]
  }

  getValue(name: string) {
    if (typeof this.derivedValues[name] === undefined) {
      // init so it will be observable
      this.derivedValues[name] = null
    }
    return this.derivedValues[name]
  }

  getFilters(names: string[]) {
    // re-read on new mounts
    this.mountKey
    const keys = Object.keys(this.values).filter(x => names.some(y => y === x))
    const fields = keys.map(key => this.values[key])
    const selectFields = fields
      .filter(x => x.type === 'select')
      // can have multiple values
      .map((x, i) => {
        const key = keys[i]
        return Array.isArray(x.value)
          ? x.value.map(y => createIncludeFilter(key, y.value))
          : x.value
          ? createIncludeFilter(key, x.value.value)
          : null
      })
      .flat()
      .filter(Boolean)
    return selectFields
  }
}

export function Form({
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
  nodeRef,
  ...sectionProps
}: FormProps<FormFieldsObj>) {
  const formStore = parentUseForm ? useStore(parentUseForm) : useCreateForm({ fields, errors })
  const finalFields = formStore.props ? formStore.props.fields : undefined
  let elements = children
  const fieldElements = useFormFields(formStore, finalFields)
  if (finalFields) {
    elements = (
      <>
        {fieldElements}
        {children}
      </>
    )
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
            fieldErrors[key] = 'is required.'
            continue
          }

          if (typeof field.validate === 'function') {
            const err = field.validate(field.value)
            if (err) {
              fieldErrors[key] = err
            }
            continue
          }

          // set final value to callback
          values[key] = field.value
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
      ref={nodeRef}
      style={{ display: 'contents' }}
      onSubmit={onSubmitInner}
      {...{ action, method, target, name }}
    >
      <FormContext.ProvideStore value={formStore}>
        <Section background="transparent" flex={1} {...sectionProps}>
          {formStore.globalError && (
            <>
              <Message coat="error">{formStore.globalError}</Message>
              <Space />
            </>
          )}

          {!!formStore.errors && (
            <>
              <Message coat="warn">Form has errors, please check.</Message>
              <Space />
            </>
          )}

          {elements}

          {!!submitButton && (
            <>
              <Space />
              <FormField label="">
                <Button alignSelf="flex-end" size="lg" type="submit" coat="action">
                  {submitButton === true ? 'Submit' : submitButton}
                </Button>
              </FormField>
            </>
          )}
        </Section>
      </FormContext.ProvideStore>
    </form>
  )
}

function useFormFields(store: FormStore, fields: FormFieldsObj): React.ReactNode {
  const values = useReaction(() => store.derivedValues, { defaultValue: store.derivedValues })
  return Object.keys(fields || {}).map(key => {
    const field = fields[key]
    return (
      <FormField
        key={key}
        label={field.label}
        name={key}
        type={DataType[field.type]}
        defaultValue={selectDefined(values ? values[key] : undefined, field.value, '')}
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

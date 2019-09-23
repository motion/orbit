import { useReaction, useStore } from '@o/use-store'
import { selectDefined } from '@o/utils'
import React, { useCallback } from 'react'

import { Button } from '../buttons/Button'
import { Section } from '../Section'
import { Space } from '../Space'
import { TableFilterIncludeExclude } from '../tables/types'
import { Message } from '../text/Message'
import { DataType } from '../types'
import { FormContext, useCreateForm, useParentForm } from './FormContext'
import { FormField } from './FormField'
import { FormStore } from './FormStore'
import { FormFieldsObj, FormProps } from './types'

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

export function createIncludeFilter(label: string, value: any): TableFilterIncludeExclude {
  return {
    value,
    type: 'include',
    key: label,
  }
}

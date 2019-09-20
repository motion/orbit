import React, { HTMLProps, Ref } from 'react'

import { SectionProps } from '../Section'
import { FormStore } from './FormStore'
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

export type FormValues = { [key in keyof FormFieldsObj]: any }
export type FormFieldsObj = { [key: string]: FormFieldType }

/**
 * Used to describe if any errors exist on the form.
 * If falsy, no problem, if truthful, shows an error.
 * Maps to fields.
 * */
export type FormErrors<A> = { [key in keyof A]: string } | string | null | true | void

export type FormFieldType =
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

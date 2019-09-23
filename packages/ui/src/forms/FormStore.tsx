import { isEqual } from '@o/fast-compare'
import { ensure, react, shallow } from '@o/use-store'
import { selectDefined } from '@o/utils'

import { createIncludeFilter } from './Form'
import { FormErrors, FormFieldsObj, FormFieldType, FormStoreProps } from './types'

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

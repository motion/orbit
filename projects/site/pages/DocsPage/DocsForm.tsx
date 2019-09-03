import { Form, FormField, Input, Select, Toggle, useCreateForm } from '@o/ui'
import React from 'react'

export let Simple = (
  <Form>
    <Input />
    <Toggle />
    <Select options={['One', 'Two', 'Three']} />
  </Form>
)

export let FormFieldExample = (
  <Form>
    <FormField label="Name">
      <Input placeholder="Name..." />
    </FormField>
    <FormField label="Age">
      <Select options={['One', 'Two', 'Three']} />
    </FormField>
  </Form>
)

export let FormObject = () => {
  const form = useCreateForm({
    fields: {
      name: {
        label: 'Name',
        required: true,
      },
      selection: {
        label: 'Age',
        type: 'select',
        value: {
          options: ['One', 'Two', 'Three'],
        },
        required: true,
      },
    },
  })

  return <Form useForm={form} submitButton />
}

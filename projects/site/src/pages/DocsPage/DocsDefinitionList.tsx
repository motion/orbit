import { DefinitionList } from '@o/ui'
import React from 'react'

export let Simple = (
  <DefinitionList
    columns={['Name', 'Email Address', 'Date of Birth', 'Description']}
    row={{
      name: 'Nate Wienert',
      email: 'nate@tryorbit.com',
      birthdate: '02/12/1989',
      description: 'Lorem ipsum dolor sit amet.',
    }}
  />
)

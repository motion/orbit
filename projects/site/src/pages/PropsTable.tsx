import { Stack, Tag, TitleRow } from '@o/ui'
import React from 'react'

import { Paragraph } from '../views/Paragraph'

export function PropsTable(props: { props: Object }) {
  const propRows = Object.keys(props.props)
    .reduce((acc, key) => {
      const { type, description, defaultValue, required, ...row } = props.props[key]
      acc.push({
        ...row,
        description,
        type: type.name.trim(),
        'Default Value': defaultValue === null ? '' : defaultValue,
        required,
      })
      return acc
    }, [])
    .sort((a, b) => {
      if (a.required && !b.required) {
        return -1
      }
      // if (a.description && !b.description) {
      //   return -1
      // }
      return a.type.localeCompare(b.type)
    })

  // overscan all for searchability
  return (
    <Stack space>
      {propRows.map(row => (
        <Stack space key={row.name}>
          <TitleRow padding bordered borderSize={2}>
            <Stack direction="horizontal" space alignItems="center">
              <Tag coat="lightBlue">{row.name}</Tag>
              <Tag coat="lightGreen" size={0.75}>
                {row.type}
              </Tag>
              {row.required && (
                <Tag coat="lightRed" size={0.75}>
                  Required
                </Tag>
              )}
            </Stack>
          </TitleRow>
          {!!row.description && <Paragraph>{row.description}</Paragraph>}
        </Stack>
      ))}
    </Stack>
  )
}

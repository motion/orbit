import { DataInspector } from '@o/ui'
import React from 'react'

export function CustomAppTree() {
  return (
    <>
      <DataInspector
        data={{
          test: 'this',
          thing: 0,
          is: 'hi',
          who: 'are',
          you: new Date(),
          another: {
            one: 'color',
            two: 'green',
          },
        }}
      />
    </>
  )
}

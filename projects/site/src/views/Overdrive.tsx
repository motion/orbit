import React from 'react'
import ReactOverdrive from 'react-overdrive'

export const Overdrive = (props: { id: string; children: any }) => (
  <ReactOverdrive
    style={{
      zIndex: 10000000,
      display: 'flex',
      flexDirection: 'inherit',
      flexWrap: 'inherit',
      flexGrow: 'inherit',
    }}
    {...props}
  />
)

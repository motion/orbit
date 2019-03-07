import { Absolute, Row } from '@o/gloss'
import React from 'react'
import { BorderBottom } from '../Border'
import { PassProps } from '../helpers/passProps'
import { Input, InputProps } from './Input'

export function InputRow({ buttons, ...props }: InputProps & { buttons: React.ReactNode }) {
  return (
    <Row position="relative">
      <BorderBottom opacity={0.25} />
      <Input
        chromeless
        sizeRadius={0}
        paddingLeft={12}
        paddingRight={40}
        height={33}
        flex={1}
        {...props}
      />
      <Absolute top={0} right={12} bottom={0}>
        <Row flex={1} alignItems="center">
          <PassProps chromeless opacity={0.35} hoverOpacity={1}>
            {buttons}
          </PassProps>
        </Row>
      </Absolute>
    </Row>
  )
}

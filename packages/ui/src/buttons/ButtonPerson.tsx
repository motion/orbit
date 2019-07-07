import { Row } from 'gloss'
import * as React from 'react'
import { Image } from '../Image'
import { Text } from '../text/Text'
import { ButtonProps } from './Button'
import { RoundButton } from './RoundButton'

type PersonButtonProps = Omit<ButtonProps, 'children'> & {
  photo?: string
  children?: string
}

export function ButtonPerson({ photo, children, ...props }: PersonButtonProps) {
  return (
    <RoundButton size={0.95} sizeHeight={0.8} {...props}>
      <Row alignItems="center">
        {!!photo && (
          <Image
            src={photo}
            borderRadius={100}
            width={14}
            height={14}
            marginRight={6}
            marginLeft={-1}
          />
        )}
        <Text size={0.95} fontWeight={600} alpha={0.9} alignItems="center">
          {children}
        </Text>
      </Row>
    </RoundButton>
  )
}

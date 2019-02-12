import { loadOne } from '../mediator'
import { Person, PersonBitModel } from '@mcro/models'
import * as UI from '@mcro/ui'
import { ButtonProps } from '@mcro/ui'
import * as React from 'react'
import { AppActions } from '../actions/AppActions'
import { RoundButton } from './RoundButton'

type PersonButtonProps = ButtonProps & {
  person?: Person
}

export const handleClickPerson = (email: string) => async e => {
  e.stopPropagation()
  const personBit = await loadOne(PersonBitModel, {
    args: {
      where: {
        email,
      },
    },
  })
  if (!personBit) {
    console.log('no personBit found', email)
  } else {
    AppActions.togglePeekApp(personBit)
  }
}

export const RoundButtonPerson = ({ person, hideAvatar, ...props }: PersonButtonProps) => {
  // TODO: avatar value on person
  const avatar = person.photo
  return (
    <RoundButton size={0.95} sizeHeight={0.8} onClick={handleClickPerson(person.email)} {...props}>
      <UI.Row alignItems="center">
        {!!avatar && !hideAvatar && (
          <UI.Image
            src={avatar}
            borderRadius={100}
            width={14}
            height={14}
            marginRight={6}
            marginLeft={-1}
          />
        )}
        <UI.Text size={0.95} fontWeight={600} alpha={0.9} alignItems="center">
          {person.name}
        </UI.Text>
      </UI.Row>
    </RoundButton>
  )
}

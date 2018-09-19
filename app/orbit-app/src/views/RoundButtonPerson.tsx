import { loadOne } from '@mcro/model-bridge'
import { Person, PersonBitModel } from '@mcro/models'
import * as UI from '@mcro/ui'
import { ButtonProps } from '@mcro/ui'
import * as React from 'react'
import { Actions } from '../actions/Actions'
import { RoundButton } from './RoundButton'

type PersonButtonProps = ButtonProps & {
  person?: Person
}

const handleClick = (person: Person) => async e => {
  e.stopPropagation()
  const personBit = await loadOne(PersonBitModel, {
    args: {
      where: {
        email: person.email
      },
    }
  })
  if (!personBit) {
    console.log('no personBit found', person)
  } else {
    Actions.togglePeekApp(personBit)
  }
}

export const RoundButtonPerson = ({ person, ...props }: PersonButtonProps) => {
  // TODO: avatar value on person
  const avatar = person.photo
  return (
    <RoundButton size={0.95} onClick={handleClick(person)} {...props}>
      <UI.Row alignItems="center">
        {!!avatar && (
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

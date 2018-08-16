import * as React from 'react'
import { App } from '@mcro/stores'
import { RoundButton } from './RoundButton'
import * as UI from '@mcro/ui'

export const RoundButtonPerson = ({ person }) => {
  // TODO: avatar value on person
  const avatar = person.data.profile.image_512
  return (
    <RoundButton
      size={1.1}
      onClick={e => {
        e.stopPropagation()
        App.actions.selectPerson(person)
      }}
    >
      <UI.Row alignItems="center">
        <UI.Image
          if={avatar}
          src={avatar}
          borderRadius={100}
          width={15}
          height={15}
          marginRight={5}
          marginLeft={-1}
        />
        <UI.Col
          fontWeight={400}
          fontSize="95%"
          color="#000"
          margin={[0, 0, 1]}
          alignItems="center"
        >
          {person.name}
        </UI.Col>
      </UI.Row>
    </RoundButton>
  )
}

import * as React from 'react'
import { App } from '@mcro/stores'
import { RoundButton } from './RoundButton'
import * as UI from '@mcro/ui'

export const RoundButtonPerson = ({ person, ...props }) => {
  // TODO: avatar value on person
  const avatar = person.photo
  return (
    <RoundButton
      size={0.95}
      onClick={e => {
        e.stopPropagation()
        App.actions.selectPerson(person)
      }}
      {...props}
    >
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

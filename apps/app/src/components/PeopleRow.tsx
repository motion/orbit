import * as React from 'react'
import { attachTheme } from '@mcro/black'
import * as UI from '@mcro/ui'
import * as _ from 'lodash'

const shortName = name => {
  const names = name.split(' ')
  const lastInitial = names[1] ? ` ${_.capitalize(names[1])[0]}.` : ''
  return `${_.capitalize(names[0])}${lastInitial}`
}

export const PeopleRow = attachTheme(({ people, theme }) => {
  const total = people.length
  const half = total / 2
  return (
    <UI.Row padding={[8, 0, 0]}>
      <UI.Row marginRight={14}>
        {people.map((person, i) => (
          <UI.Image
            key={i}
            width={20}
            height={20}
            marginRight={-10}
            borderRadius={100}
            border={[2, theme.base.background]}
            transform={{
              rotate: `${(i + half - total / total) * 12}deg`,
            }}
            src={person.data.profile.image_512}
          />
        ))}
      </UI.Row>
      <UI.Row>
        <UI.Text size={0.95} alpha={0.5}>
          {people.map((person, i) => (
            <UI.Inline marginRight={4} key={i}>
              {shortName(person.name)}
            </UI.Inline>
          ))}
        </UI.Text>
      </UI.Row>
    </UI.Row>
  )
})

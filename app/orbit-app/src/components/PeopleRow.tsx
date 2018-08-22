import * as React from 'react'
import { attachTheme } from '@mcro/gloss'
import * as UI from '@mcro/ui'
import { capitalize } from 'lodash'

const shortName = name => {
  const names = name.split(' ')
  const lastInitial = names[1] ? ` ${capitalize(names[1])[0]}.` : ''
  return `${capitalize(names[0])}${lastInitial}`
}

export const PeopleRow = attachTheme(({ people, theme }) => {
  const total = people.length
  const half = total / 2
  return (
    <UI.Row padding={[3, 0, 0]}>
      <UI.Row marginRight={14} alignItems="center">
        {people.map((person, i) => (
          <UI.Image
            key={i}
            width={16}
            height={16}
            marginRight={-10}
            borderRadius={100}
            border={[1, theme.background.lighten(2)]}
            transform={{
              rotate: `${(i + half - total / total) * 12}deg`,
            }}
            src={person.photo}
          />
        ))}
      </UI.Row>
      <UI.Row>
        <UI.Text size={0.95} alpha={0.6} fontWeight={500}>
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

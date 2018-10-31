import * as React from 'react'
import { attachTheme } from '@mcro/gloss'
import * as UI from '@mcro/ui'
import { AppActions } from '../actions/AppActions'
import { PersonBit } from '@mcro/models'
import { memoize } from 'lodash'

const shortName = name => {
  const names = name.split(' ')
  const lastInitial = names[1] ? ` ${names[1][0]}.` : ''
  return `${names[0]}${lastInitial}`
}

const handleClick = memoize((person: PersonBit) => e => {
  e.stopPropagation()
  e.preventDefault()
  AppActions.queryTogglePersonFilter(person.name)
})

const Person = props => (
  <UI.Inline marginRight={4} onClick={handleClick(props.person)}>
    {shortName(props.person.name)}
    {props.after}
  </UI.Inline>
)

export const PeopleRow = attachTheme(({ people, theme }) => {
  const total = (people || []).length
  if (total === 0) {
    return null
  }
  const half = total / 2
  return (
    <UI.Row alignItems="center" marginRight={20} maxWidth="calc(100% - 20px)">
      <UI.Row marginRight={14} alignItems="center">
        {(people || []).slice(0, 3).map((person, i) => (
          <UI.Image
            key={i}
            width={13}
            height={13}
            marginRight={-10}
            borderRadius={100}
            border={[1, theme.background.lighten(2)]}
            transform={{
              rotate: `${(i + half - total / total) * 12}deg`,
              x: 1,
            }}
            src={person.photo}
          />
        ))}
      </UI.Row>
      <UI.Row alignItems="center" flex={1} overflow="hidden" whiteSpace="nowrap">
        <UI.Text size={0.9} alpha={0.6} fontWeight={400}>
          {people.length <= 2 &&
            (people || []).map((person, i) => (
              <Person key={i} person={person} after={i < people.length - 1 ? ',' : ''} />
            ))}
          {people.length > 2 && (
            <>
              <Person person={people[0]} /> +{people.length - 1}
            </>
          )}
        </UI.Text>
      </UI.Row>
    </UI.Row>
  )
})

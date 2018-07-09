import * as React from 'react'
import { view } from '@mcro/black'
import * as UI from '@mcro/ui'
import * as _ from 'lodash'

const shortName = name => {
  const names = name.split(' ')
  const lastInitial = names[1] ? ` ${_.capitalize(names[1])[0]}.` : ''
  return `${_.capitalize(names[0])}${lastInitial}`
}

@view.ui
export class PeopleRow extends React.Component {
  render({ people }) {
    const total = people.length
    const half = total / 2
    return (
      <row>
        <images>
          {people.map((person, i) => (
            <img
              key={i}
              css={{
                transform: {
                  rotate: `${(i + half - total / total) * 12}deg`,
                },
              }}
              src={person.data.profile.image_512}
            />
          ))}
        </images>
        <names>
          <UI.Text size={0.95} alpha={0.5}>
            {people.map((person, i) => (
              <span $person key={i}>
                {shortName(person.name)}
              </span>
            ))}
          </UI.Text>
        </names>
      </row>
    )
  }

  static style = {
    row: {
      flexFlow: 'row',
      padding: [8, 0, 0],
    },
    images: {
      flexFlow: 'row',
      marginRight: 14,
    },
    img: {
      width: 20,
      height: 20,
      marginRight: -10,
      borderRadius: 100,
    },
    person: {
      marginRight: 4,
    },
    names: {
      flexFlow: 'row',
    },
  }

  static theme = ({ theme }) => {
    return {
      img: {
        border: [2, theme.base.background],
      },
    }
  }
}

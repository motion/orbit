import { react } from '@o/use-store'
import * as React from 'react'

type Props = { query?: string }

class SaliencyStore {
  props: Props

  texts = {
    jfk: `We choose to go to the moon. We choose to go to the moon in this decade and do the other things, not because they are easy, but because they are hard, because that goal will serve to organize and measure the best of our energies and skills, because that challenge is one that we are willing to accept, one we are unwilling to postpone, and one which we intend to win, and the others, too.
  It is for these reasons that I regard the decision last year to shift our efforts in space from low to high gear as among the most important decisions that will be made during my incumbency in the office of the Presidency.`,
    erdos: `Paul Erdős was a Hungarian mathematician. He was one of the most prolific mathematicians of the 20th century. He was known both for his social practice of mathematics (he engaged more than 500 collaborators) and for his eccentric lifestyle. He devoted his waking hours to mathematics, even into his later years—indeed, his death came only hours after he solved a geometry problem in a conference in Warsaw.
    Erdős pursued and proposed problems in discrete mathematics, graph theory, number theory, mathematical analysis, approximation theory, set theory, and probability theory.[4] Much of his work centered around discrete mathematics, cracking many previously unsolved problems in the field. He championed and contributed to Ramsey theory, which studied the conditions in which order necessarily appears. Overall, his work leaned towards solving previously open problems, rather than developing or exploring new areas of mathematics.
    Erdős published around 1,500 mathematical papers during his lifetime, a figure that remains unsurpassed. He firmly believed mathematics to be a social activity, living an itinerant lifestyle with the sole purpose of writing mathematical papers with other mathematicians. Erdős's prolific output with co-authors prompted the creation of the Erdős number, the number of steps in the shortest path between a mathematician and Erdős in terms of co-authorships.`,
    glasses: `always wear glasses`,
  }

  query = 'hello world'

  saliency = react(
    async () => {
      return await fetch(
        `http://localhost:4444/weights?query=${this.props.query || this.query}`,
      ).then(res => res.json())
    },
    {
      defaultValue: [],
    },
  )
}

// const decorate = compose(
//   attach({
//     store: SaliencyStore,
//   }),
//   view,
// )
export default (function Saliency({ query, store }: Props & { store: SaliencyStore }) {
  return (
    <div style={{ padding: 10 }}>
      {typeof query === 'undefined' && (
        <div style={{ flexDirection: 'row' }}>
          {Object.keys(store.texts).map(name => (
            <div
              key={name}
              onClick={() => (store.query = store.texts[name])}
              style={{ marginRight: 10 }}
            >
              {name}
            </div>
          ))}
        </div>
      )}
      <div
        style={{
          flexDirection: 'row',
          padding: 10,
          flexWrap: 'wrap',
          lineHeight: '3rem',
          fontSize: 18,
        }}
      >
        {store.saliency.map(({ string, weight }, index) => (
          <Word key={index}>
            <Bar>
              <Pct style={{ height: `${weight * 100}%`, opacity: weight }} />
            </Bar>
            {string}
          </Word>
        ))}
      </div>
    </div>
  )
})

// const Word = gloss({
//   flexDirection: 'row',
//   alignItems: 'center',
//   marginRight: 14,
// })

// const Bar = glos({
//   width: 6,
//   border: [1, '#ccc'],
//   background: '#fff',
//   height: 22,
//   display: 'inline-block',
//   position: 'relative',
//   marginRight: 4,
// })

// const Pct = glos({
//   width: '100%',
//   background: 'blue',
//   display: 'inline-block',
//   position: 'absolute',
//   bottom: 0,
//   left: 0,
// })

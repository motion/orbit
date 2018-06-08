import * as React from 'react'
import { view } from '@mcro/black'
import * as UI from '@mcro/ui'
import { OrbitCard } from './orbitCard'
import { OrbitIcon } from './orbitIcon'

const diameter = 100
const itemSize = 32

@view.ui
export class OrbitCardTeam {
  render({ store, title, topics, people, recently, ...props }) {
    const results = store.results.slice(0, 8)
    return (
      <OrbitCard
        title={title}
        afterTitle={
          <div $$row>
            <UI.PassProps size={24} css={{ margin: [0, 0, 0, 12] }}>
              <OrbitIcon icon="slack" />
              <OrbitIcon icon="github" />
              <OrbitIcon icon="gdocs" />
              <OrbitIcon icon="gmail" />
            </UI.PassProps>
          </div>
        }
        index={0}
        {...props}
      >
        <content css={{ flexFlow: 'row', padding: [15, 0] }}>
          <people
            css={{
              position: 'relative',
              width: diameter,
              height: diameter,
              flexFlow: 'row',
            }}
          >
            <info $$centered $$flex css={{ zIndex: 11 }}>
              <UI.Text size={2} css={{ marginBottom: -4 }}>
                {people}
              </UI.Text>
              <UI.Text size={0.9}>people</UI.Text>
            </info>
            <ring
              $$fullscreen
              css={{
                // border: [12, [255, 255, 255, 0.3]],
                borderRadius: diameter,
                background: '#fff',
                zIndex: 10,
                margin: 10,
              }}
            />
            {results.map((person, index) => {
              const angle = 360 / results.length
              return (
                <person
                  key={index}
                  css={{
                    position: 'absolute',
                    top: 0,
                    left: diameter / 2 - itemSize / 2,
                    height: diameter,
                    transform: {
                      rotate: `${angle * index}deg`,
                      x: diameter / 4 - itemSize / 2,
                    },
                  }}
                >
                  <img
                    css={{
                      width: itemSize,
                      height: itemSize,
                      borderRadius: 100,
                      transform: { rotate: `-${angle * index}deg` },
                    }}
                    src={person.data.profile.image_512}
                  />
                </person>
              )
            })}
          </people>
          <preview css={{ padding: [0, 15] }}>
            <UI.Text css={{ marginBottom: 3 }} fontWeight={800} color="#000">
              Topics
            </UI.Text>
            <section>{topics}</section>
            <vertSpace css={{ height: 8 }} />
            <UI.Text css={{ marginBottom: 3 }} fontWeight={800} color="#000">
              Recently
            </UI.Text>
            <section $$row>
              {recently.map((item, index) => (
                <item key={index} css={{ padding: [2, 4] }} $$row $$centered>
                  <OrbitIcon
                    icon={item.type}
                    size={18}
                    css={{ marginRight: 6 }}
                  />
                  {item.title}
                </item>
              ))}
            </section>
          </preview>
        </content>
      </OrbitCard>
    )
  }
}

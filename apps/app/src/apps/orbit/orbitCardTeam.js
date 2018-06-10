import * as React from 'react'
import { view } from '@mcro/black'
import * as UI from '@mcro/ui'
import { OrbitCard } from './orbitCard'
import { OrbitIcon } from './orbitIcon'

const diameter = 100
const itemSize = 32
const adjustIn = 8

@view.ui
export class OrbitCardTeam extends React.Component {
  render({ store, bit, expanded, ...props }) {
    const connections = (
      <div $$row css={{ padding: 5 }}>
        <UI.PassProps
          size={expanded ? 20 : 16}
          css={expanded ? { margin: [0, 0, 0, 12] } : { margin: [0, 12, 0, 0] }}
        >
          <OrbitIcon icon="slack" />
          <OrbitIcon icon="github" />
          <OrbitIcon icon="gdocs" />
          <OrbitIcon icon="gmail" />
        </UI.PassProps>
      </div>
    )
    return (
      <OrbitCard
        title={bit.title}
        titleProps={{ ellipse: 1 }}
        bit={bit}
        afterTitle={expanded && connections}
        index={0}
        {...props}
      >
        {(_, { background }) => (
          <OrbitCardTeamContent
            connections={connections}
            background={background}
            {...this.props}
          />
        )}
      </OrbitCard>
    )
  }
}

@view.ui
class OrbitCardTeamContent extends React.Component {
  render({ background, store, bit, expanded, connections }) {
    const { topics, people, recently } = bit.data
    const results = store.results.slice(8, 28)
    return (
      <React.Fragment>
        <content css={{ flexFlow: 'row', padding: [15, 0] }}>
          <people
            css={{
              position: 'relative',
              margin: [0, 'auto'],
              width: diameter,
              height: diameter,
              flexFlow: 'row',
              transform: {
                scale: expanded ? 1 : 0.85,
              },
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
                // not updating...
                background: '#fff' || background,
                borderRadius: diameter,
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
                    top: adjustIn / 2,
                    left: diameter / 2 - itemSize / 2,
                    height: diameter - adjustIn,
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
          <preview if={expanded} css={{ padding: [0, 15] }}>
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
                    size={16}
                    css={{
                      marginRight: 6,
                      filter: 'grayscale(100%)',
                    }}
                  />
                  {item.title}
                </item>
              ))}
            </section>
          </preview>
        </content>
        {!expanded && connections}
      </React.Fragment>
    )
  }
}

import * as React from 'react'
import { view } from '@mcro/black'
import * as UI from '@mcro/ui'
import { OrbitCard } from './orbitCard'
import { OrbitIcon } from './orbitIcon'

const diameter = 100
const itemSize = 32
const adjustIn = 8

const imageStyle = {
  transformOrigin: 'bottom right',
  transform: {
    y: -6 - 3,
    x: 20 + 3,
    scale: 2.5,
    rotate: '-45deg',
  },
}

@view.ui
export class OrbitCardTeam extends React.Component {
  render({ store, bit, isExpanded, ...props }) {
    const connections = (
      <div $$row css={{ padding: 5, filter: 'grayscale(100%)', opacity: 0.5 }}>
        <UI.PassProps
          size={16}
          css={
            isExpanded ? { margin: [0, 0, 0, 12] } : { margin: [0, 12, 0, 0] }
          }
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
        afterTitle={isExpanded && connections}
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
  render({ background, store, bit, isExpanded, connections }) {
    const { topics, people, recently } = bit.data
    const results = store.results.slice(8, 28)
    const extraHeight = 20
    return (
      <React.Fragment>
        <content
          css={{ flexFlow: 'row', padding: [10 + extraHeight, 0, extraHeight] }}
        >
          <people
            css={{
              position: 'relative',
              margin: [0, 'auto'],
              width: diameter,
              height: diameter,
              flexFlow: 'row',
              transform: {
                scale: isExpanded ? 1 : 0.85,
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
          <preview if={isExpanded} css={{ padding: [0, 15], flex: 1 }}>
            <UI.Text
              if={false}
              ellipse={1}
              css={{ marginBottom: 3, width: '100%' }}
              size={1.2}
            >
              <strong>Topics</strong>&nbsp;&nbsp;{topics}
            </UI.Text>
            <section $$row css={{ flex: 1, margin: [-extraHeight, 0] }}>
              {recently.map((item, index) => (
                <item
                  key={index}
                  css={{
                    padding: 6,
                    overflow: 'hidden',
                    margin: [0, 10, 0, 0],
                    position: 'relative',
                    border: [1, [0, 0, 0, 0.1]],
                    borderRadius: 6,
                    width: 120,
                    flex: 1,
                  }}
                >
                  <OrbitIcon
                    icon={item.type}
                    size={16}
                    css={{
                      position: 'absolute',
                      top: 0,
                      right: 0,
                      ...imageStyle,
                    }}
                  />
                  <UI.Text
                    ellipse={1}
                    size={1.3}
                    css={{ width: '93%' }}
                    fontWeight={600}
                  >
                    {item.title}
                  </UI.Text>
                  {item.title}
                  <div $$flex />
                  <UI.Text size={0.9} alpha={0.5}>
                    2 minutes
                  </UI.Text>
                </item>
              ))}
            </section>
          </preview>
        </content>
        {!isExpanded && connections}
      </React.Fragment>
    )
  }
}

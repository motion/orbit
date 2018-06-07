import * as React from 'react'
import { view, react } from '@mcro/black'
import * as UI from '@mcro/ui'
import { Person } from '@mcro/models'
import { OrbitDockedPane } from './orbitDockedPane'
import { OrbitCard } from './orbitCard'
import { Masonry } from '~/views/masonry'
import { SubTitle } from '~/views'
import { OrbitIcon } from './orbitIcon'

class OrbitDirectoryStore {
  setGetResults = react(
    () => [this.props.paneStore.activePane === this.props.name, this.results],
    ([isActive]) => {
      if (!isActive) {
        throw react.cancel
      }
      this.props.appStore.setGetResults(() => this.results)
    },
    { immediate: true },
  )

  results = react(
    async () => {
      return await Person.find({ take: 10 })
    },
    { defaultValue: [] },
  )
}

const diameter = 100
const itemSize = 32

@view({
  store: OrbitDirectoryStore,
})
export class OrbitDirectory {
  render({ store }) {
    log('DIRECTORY --------')
    const results = store.results.slice(0, 8)
    return (
      <OrbitDockedPane name="directory">
        <SubTitle>Teams</SubTitle>
        <items>
          <UI.PassProps
            pane="summary"
            subPane="directory"
            style={{
              gridColumnEnd: 'span 2',
            }}
            total={10}
          >
            <OrbitCard
              title="Engineering"
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
                      19
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
                  <UI.Text
                    css={{ marginBottom: 3 }}
                    fontWeight={800}
                    color="#000"
                  >
                    Topics
                  </UI.Text>
                  <section>Cosal, pTSNE, memorial, left</section>
                  <vertSpace css={{ height: 8 }} />
                  <UI.Text
                    css={{ marginBottom: 3 }}
                    fontWeight={800}
                    color="#000"
                  >
                    Recently
                  </UI.Text>
                  <section $$row>
                    <item css={{ padding: [2, 4] }} $$row $$centered>
                      <OrbitIcon
                        icon="github"
                        size={18}
                        css={{ marginRight: 6 }}
                      />
                      Stores, hmr
                    </item>
                    <item css={{ padding: [2, 4] }} $$row $$centered>
                      <OrbitIcon
                        icon="gdocs"
                        size={18}
                        css={{ marginRight: 6 }}
                      />
                      Some Document
                    </item>
                    <item css={{ padding: [2, 4] }} $$row $$centered>
                      <OrbitIcon
                        icon="slack"
                        size={18}
                        css={{ marginRight: 6 }}
                      />
                      Product page
                    </item>
                  </section>
                </preview>
              </content>
            </OrbitCard>
          </UI.PassProps>
        </items>

        <br />
        <br />

        <SubTitle>People</SubTitle>
        <Masonry>
          {store.results.map((bit, index) => (
            <OrbitCard
              pane="summary"
              subPane="directory"
              key={`${bit.id}${index}`}
              index={index}
              bit={bit}
              total={store.results.length}
              hoverToSelect
            />
          ))}
        </Masonry>
      </OrbitDockedPane>
    )
  }
}

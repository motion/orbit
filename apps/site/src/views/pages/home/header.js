import * as React from 'react'
import * as UI from '@mcro/ui'
import * as View from '~/views'
import * as Constants from '~/constants'
import { view } from '@mcro/black'
import Illustration1 from './header/illustration1'
import Illustration2 from './header/illustration2'
import Header from '../views/header'

@view
export default class HomeHeader {
  render() {
    return (
      <View.Section
        css={{
          position: 'relative',
          background: `linear-gradient(${Constants.dark1}, ${Constants.dark2})`,
          overflow: 'hidden',
        }}
      >
        <Header />

        <View.SectionContent
          css={{
            margin: 'auto',
            padding: [300, 0, 50],
          }}
        >
          <content
            $$row
            css={{
              justifyContent: 'space-between',
            }}
          >
            <UI.Theme name="dark">
              <section
                css={{
                  marginTop: -70,
                  // marginBottom: 40,
                  height: 560,
                  position: 'relative',
                  width: '45%',
                  transform: {
                    y: -120,
                  },
                }}
              >
                <View.Title size={2.8} fontWeight={300} textAlign="right">
                  Company knowledge shouldn't be such a pain
                </View.Title>

                <inner
                  css={{
                    position: 'relative',
                    margin: [70, 0, 40, 0],
                    userSelect: 'none',
                  }}
                >
                  <img
                    src="/watercolor.png"
                    css={{
                      position: 'absolute',
                      top: 0,
                      opacity: 0.6,
                      left: -40,
                      width: 2022,
                      height: 904,
                      zIndex: 0,
                      transformOrigin: 'top left',
                      transform: { scale: 0.5 },
                      filter: 'hue-rotate(-45deg) brightness(0.99)',
                      margin: '-20%',
                    }}
                  />
                  <Illustration1 css={{ transform: { scale: 1 } }} />
                </inner>
              </section>
            </UI.Theme>
            <stripeBetween
              $$fullscreen
              css={{
                // left: 0,
                left: '50%',
                marginRight: -740,
                background: '#fff',
                zIndex: 10,
                transform: {
                  rotate: '96.5deg',
                  scale: 1,
                  y: 155,
                },
              }}
            />
            <section
              css={{
                marginTop: -20,
                width: '45%',
                zIndex: 20,
                position: 'relative',
                transform: {
                  y: -50,
                },
              }}
            >
              <inner
                css={{
                  position: 'relative',
                  minHeight: 250,
                  margin: [20, 0, 0],
                  userSelect: 'none',
                }}
              >
                <Illustration2 css={{ transform: { scale: 1 } }} />
              </inner>

              <text css={{ margin: [60, 0, 0, 40] }}>
                <View.Title
                  textAlign="left"
                  size={2.8}
                  fontWeight={300}
                  color={Constants.dark2}
                >
                  Orbit keeps your team in sync without hassle.
                </View.Title>

                <arrows css={{ position: 'absolute', right: 0 }}>
                  <arrowVertical
                    css={{
                      position: 'absolute',
                      top: 200,
                      right: Constants.ORA_WIDTH / 2,
                      width: 10,
                      paddingLeft: 40,
                      height: 200,
                      // borderRight: [4, 'solid', '#fff'],
                      borderImage: 'linear-gradient(transparent, #fff) 1 100%',
                      borderWidth: 4,
                      borderRightStyle: 'solid',
                      opacity: 0.3,
                      alignItems: 'center',
                    }}
                  >
                    <UI.Arrow
                      css={{
                        position: 'absolute',
                        bottom: 0,
                        marginBottom: -30,
                        marginLeft: 2,
                      }}
                      color="#fff"
                      size={30}
                    />
                  </arrowVertical>
                </arrows>

                <afterwards
                  if={false}
                  css={{
                    marginTop: 30,
                    fontFamily: 'Hand of Sean',
                    fontSize: 20,
                    color: Constants.colorMain,
                    opacity: 0.75,
                  }}
                >
                  & lets you stop worrying about the cloud.
                </afterwards>
              </text>
            </section>
          </content>
        </View.SectionContent>
      </View.Section>
    )
  }
}

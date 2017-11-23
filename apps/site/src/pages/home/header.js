import * as React from 'react'
import * as UI from '@mcro/ui'
import * as View from '~/views'
import * as Constants from '~/constants'
import { view } from '@mcro/black'
import Illustration1 from './header/illustration1'
import Illustration2 from './header/illustration2'

const titleProps = {
  size: 2.5,
  fontWeight: 200,
}

@view
export default class HomeHeader {
  render() {
    return (
      <View.Section
        css={{
          position: 'relative',
          background: `linear-gradient(${Constants.dark1}, #000)`,
          overflow: 'hidden',
          minHeight: Constants.ORA_TOP,
        }}
      >
        <View.Header />

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
                  marginTop: -210,
                  height: 560,
                  position: 'relative',
                  width: '45%',
                }}
              >
                <View.Title {...titleProps} textAlign="right">
                  Company knowledge shouldn't be so messy
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
                marginLeft: 50,
                top: -250,
                bottom: -200,
                right: '-150%',
                left: '50%',
                background: '#fff',
                zIndex: 10,
              }}
            >
              <div
                css={{
                  position: 'absolute',
                  background: '#fff',
                  top: 0,
                  left: 0,
                  bottom: 0,
                  width: 100,
                  zIndex: 100,
                  transformOrigin: 'top left',
                  transform: {
                    rotate: '4deg',
                  },
                }}
              />
            </stripeBetween>

            <section
              css={{
                marginTop: -100,
                width: '45%',
                zIndex: 20,
                position: 'relative',
              }}
            >
              <inner
                css={{
                  position: 'relative',
                  minHeight: 220,
                  margin: [20, 0, 0],
                  userSelect: 'none',
                }}
              >
                <Illustration2 css={{ transform: { scale: 1 } }} />
              </inner>

              <text css={{ margin: [65, 0, 0, 20] }}>
                <View.Title
                  {...titleProps}
                  textAlign="left"
                  color={Constants.dark2}
                >
                  Orbit keeps your team in sync, without hassle
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
                    margin: [30, 20, -30],
                    textAlign: 'center',
                    fontFamily: 'Hand of Sean',
                    fontSize: 20,
                    lineHeight: '25px',
                    color: Constants.colorMain,
                    opacity: 0.4,
                  }}
                >
                  See it in action
                </afterwards>
              </text>
            </section>
          </content>
        </View.SectionContent>
      </View.Section>
    )
  }
}

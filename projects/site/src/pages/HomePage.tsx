import * as React from 'react'
import { FullScreen, View, Theme, Row } from '@mcro/ui'
import { Parallax, ParallaxLayer } from 'react-spring/addons'
import { ViewPortText } from '../views/ViewPortText'
import { TitleText } from '../views/TitleText'
import { FadeDown } from '../views/FadeDown'
import { useWaitForFonts } from '@mcro/wait-for-fonts'
import { Paragraph } from '../views/Paragraph'

// next:
// make a thing that does multiline text sizing
// where the longest line is fit, and then the rest just use that font size
// for the sub-paragraph

export const HomePage = () => {
  const [measured, setMeasured] = React.useState(false)
  const fontsLoaded = useWaitForFonts(['Eesti Pro'])

  if (!fontsLoaded) {
    return null
  }

  return (
    <Parallax pages={3}>
      <ParallaxLayer offset={0} speed={0.5}>
        <Theme name="dark">
          <FullScreen background={theme => theme.background}>
            <Row height="80%" width="80%" margin="auto" alignItems="center">
              <View width="100%">
                <FadeDown disable={!measured}>
                  <TitleText>
                    <ViewPortText
                      onReady={() => {
                        if (!measured) {
                          setTimeout(() => {
                            setMeasured(true)
                          })
                        }
                      }}
                    >
                      Apps for teamwork
                    </ViewPortText>
                  </TitleText>

                  <Paragraph debug size={1.65} sizeLineHeight={1.2} textAlign="center" alpha={0.7}>
                    Orbit is a home for team knowledge.
                    <br />
                    Unified search, team vocabulary, and who is good at what.
                    <br />
                    It's a smart new way to manage your knowledge.
                  </Paragraph>
                </FadeDown>
              </View>
            </Row>
          </FullScreen>
        </Theme>
      </ParallaxLayer>
    </Parallax>
  )
}

HomePage.path = ''
HomePage.navigationOptions = {
  title: 'Home',
  linkName: 'Home Page',
}

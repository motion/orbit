import * as React from 'react'
import { FullScreen, View, Theme, Row } from '@mcro/ui'
import { Parallax, ParallaxLayer } from 'react-spring/addons'
import { ViewPortText } from '../views/ViewPortText'
import { TitleText } from '../views/TitleText'
import { FadeDown } from '../views/FadeDown'
import { useWaitForFonts } from '@mcro/wait-for-fonts'

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
                  <TitleText fontWeight={800}>
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

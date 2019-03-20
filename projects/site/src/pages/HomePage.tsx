import { FullScreen, Row, Space, Theme, useDebounce, View } from '@o/ui'
import { useWaitForFonts } from '@o/wait-for-fonts'
import { observer } from 'mobx-react-lite'
import React, { useState } from 'react'
import { Parallax, ParallaxLayer } from 'react-spring/renderprops-addons'
import { FadeDown } from '../views/FadeDown'
import { Paragraph } from '../views/Paragraph'
import { TitleText } from '../views/TitleText'
import { ViewPortText } from '../views/ViewPortText'

function HomePage() {
  const [measured, setMeasured] = useState(false)
  const setMeasuredDelayed = useDebounce(setMeasured, 1)
  const fontsLoaded = useWaitForFonts(['Eesti Pro'])
  const [parSize, setParSize] = useState(16)

  if (!fontsLoaded) {
    return null
  }

  const longestText = `Unified search, team vocabulary, and who is good at what.`

  return (
    <Parallax pages={3}>
      <ParallaxLayer offset={0} speed={0.5}>
        <Theme name="dark">
          <FullScreen background={theme => theme.background}>
            <Row
              height="80%"
              width="70%"
              maxWidth={900}
              minWidth={360}
              margin="auto"
              alignItems="center"
            >
              <View width="100%">
                <FadeDown disable={!measured}>
                  <TitleText>
                    <ViewPortText onReady={() => !measured && setMeasuredDelayed(true)}>
                      Apps for teamwork
                    </ViewPortText>
                  </TitleText>

                  <Space />
                  <Space />

                  <ViewPortText style={{ opacity: 0 }} min={16} onReady={setParSize}>
                    {longestText}
                  </ViewPortText>

                  <Paragraph
                    fontSize={parSize - 2}
                    sizeLineHeight={1.2}
                    textAlign="center"
                    alpha={0.7}
                  >
                    Orbit is a home for team knowledge.
                    <br />
                    {longestText}
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

export default observer(HomePage)

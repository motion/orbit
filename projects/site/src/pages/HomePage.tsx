import * as React from 'react'
import { Grid, FullScreen, View, Theme, Row } from '@mcro/ui'
import { Parallax, ParallaxLayer } from 'react-spring/addons'
import { ViewPortText } from '../views/ViewPortText'
import { TitleText } from '../views/TitleText'

export const HomePage = () => {
  return (
    <Parallax pages={3}>
      <ParallaxLayer offset={0} speed={0.5}>
        <Theme name="dark">
          <FullScreen background={theme => theme.background}>
            <Row height="80%" width="80%" margin="auto" alignItems="center">
              <View width="100%">
                <TitleText fontWeight={800}>
                  <ViewPortText>Apps for teamwork</ViewPortText>
                </TitleText>
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

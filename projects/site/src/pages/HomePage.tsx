import * as React from 'react'
import { Grid, FullScreen, View } from '@mcro/ui'
import { Parallax, ParallaxLayer } from 'react-spring/addons'
import { ViewPortText } from '../views/ViewPortText'

export const HomePage = () => {
  return (
    <Parallax pages={3}>
      <ParallaxLayer offset={0} speed={0.5}>
        <FullScreen background="red">
          <span onClick={() => this.parallax.scrollTo(1)}>
            <Grid>Layers can contain anything</Grid>
            <View width="80%" margin={[0, 'auto']}>
              <ViewPortText compressor={4}>Apps for teamwork</ViewPortText>
            </View>
          </span>
        </FullScreen>
      </ParallaxLayer>
    </Parallax>
  )
}

HomePage.path = ''
HomePage.navigationOptions = {
  title: 'Home',
  linkName: 'Home Page',
}

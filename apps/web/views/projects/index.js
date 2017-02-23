import { view } from 'my-decorators'
import { Title, Text, Page, Link } from 'my-views'
import feed from './data'
import ProjectsStore from './projectsStore'

const BG_IMG = 'http://www.reportermagazin.cz/img/58a70a569c400e1e0d4e5d9b/2560/1600?_sig=zBGa0KJC_-ci1FqMG4jJZiJzu-zwWrJEDXBqSeKyO-g'

@view.provide({
  projects: ProjectsStore,
})
export default class Projects {
  render() {
    return (
      <Page>
        <mast>
          <bg>
            <inner $$fullscreen $background={BG_IMG} />
          </bg>
          <left>
            <Title spaced>
              <hl>Donald Trump</hl> & <hl>Russia</hl>
            </Title>
            <sub>
              2017 · Ongoing
            </sub>
          </left>
          <right>
            <img src="https://www.track-trump.com/images/trump@2x.png" />
          </right>
        </mast>

        <feed>
          {feed.map(item => (
            <item key={Math.random()}>
              <marker if={item.type === 'marker'}>
                <arrow />
                {item.content}
              </marker>
              <section if={item.type === 'section'}>
                <Text key={Math.random()} $$fontSize={18} $$lineHeight="1.6rem">
                  <date if={item.date}>{item.date}</date> {item.content[0].text}
                </Text>
              </section>
            </item>
          ))}
        </feed>
      </Page>
    )
  }

  static style = {
    bg: {
      position: 'absolute',
      top: 0,
      right: -20,
      left: -20,
      height: '100%',
      zIndex: -1,
    },
    background: img => ({
      backgroundImage: `url(${img})`,
      backgroundSize: 'cover',
    }),
    mast: {
      borderBottom: [1, '#f2f2f2'],
      flexFlow: 'row',
      position: 'relative',
      height: 350,
      color: '#fff',
    },
    sub: {
      fontSize: 20,
      opacity: 0.5,
      marginTop: -10,
    },
    dot: {
      margin: [0, 10, 0, 0],
      opacity: 0.2,
    },
    left: {
      padding: [20, 0],
      flex: 1,
    },
    right: {
      justifyContent: 'flex-end',
    },
    img: {
      width: 200,
      alignSelf: 'flex-end',
    },
    hl: {
      color: '#000',
      background: 'yellow',
      display: 'inline-block',
      padding: [0, 5],
      margin: [0, -2],
    },
    feed: {
      position: 'relative',
      padding: [10, 0],
    },
    item: {
    },
    marker: {
      fontSize: 18,
      fontWeight: 600,
      padding: [0, 0, 5],
      flexFlow: 'row',
    },
    arrow: {
      background: '#eee',
      margin: ['auto', 15, 'auto', -30],
      height: 2,
      width: 25 ,
    },
    section: {
      padding: [5, 0, 15, 0],
    },
    date: {
      color: '#999',
      display: 'inline',
      margin: [0, 10, 0, 0],
      fontWeight: 300,
    },
  }
}

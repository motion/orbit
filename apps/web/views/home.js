import { view } from 'my-decorators';
import { Title, Text, Page, Link } from 'my-views';
import feed from './data'

@view
export default class Home {
  render() {
    return (
      <Page>
        <mast>
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
    );
  }

  static style = {
    mast: {
      borderBottom: [1, '#f2f2f2'],
      flexFlow: 'row',
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
      background: 'yellow',
      display: 'inline-block',
      padding: [0, 5],
      margin: [0, -2],
    },
    feed: {
      padding: 10,
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
    }
  };
}

import { view } from 'my-decorators';
import { Title, Text, Page, Link } from 'my-views';

const feed = [
  {
    type: 'marker',
    content: '2008',
  },
  {
    type: 'section',
    title: 'First Known Existence',
    date: 'Feb',
    source: 'NYTimes',
    sourceIcon: 'https://static01.nyt.com/favicon.ico',
    content: [
      {
        type: 'intro',
        text: <p>
          The server for clintonemail.com is registered under the name Eric Hoteham. Presumably a misspelling of <Link>Eric Hothem</Link>, the name of a former Clinton aide.
        </p>,
      }
    ],
  },
  {
    type: 'marker',
    content: '2009',
  },
  {
    type: 'section',
    title: 'Discovery',
    date: 'March',
    source: 'NYTimes',
    sourceIcon: 'https://static01.nyt.com/favicon.ico',
    content: [
      {
        type: 'intro',
        text: ' Government employees are allowed to use private emails for government work. However, this practice is strongly discouraged. If using a private email, "the agency must ensure that federal records sent or received on such systems are preserved in the appropriate agency record-keeping system."',
      }
    ],
  },
  {
    type: 'marker',
    content: '2010',
  },
  {
    type: 'section',
    date: 'November',
    source: 'NYTimes',
    sourceIcon: 'https://static01.nyt.com/favicon.ico',
    content: [
      {
        type: 'intro',
        text: ' Government employees are allowed to use private emails for government work. However, this practice is strongly discouraged. If using a private email, "the agency must ensure that federal records sent or received on such systems are preserved in the appropriate agency record-keeping system."',
      }
    ],
  },
]

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
                {item.content}
              </marker>
              <section if={item.type === 'section'}>
                <Title size="16" sans>
                  <title if={item.title}>{item.title}</title>
                  {item.title && ' · '}
                  <date>{item.date}</date>
                </Title>
                <pieces if={item.content}>
                  {item.content.map(content => (
                    <Text $$fontSize={20} $$lineHeight="2rem">
                      {content.text}
                    </Text>
                  ))}
                </pieces>
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
      padding: [10, 0, 0],
    },
    section: {
      padding: [5, 0, 15, 0],
      borderBottom: [1, '#f2f2f2'],
    },
    date: {
      color: '#999',
    }
  };
}

import { view } from 'my-decorators';
import { Title, Text, Page } from 'my-views';

const feed = [
  {
    title: 'First Known Existence',
    date: 'Feb 2008',
    source: 'NYTimes',
    sourceIcon: 'https://static01.nyt.com/favicon.ico',
    content: [
      {
        type: 'intro',
        text: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Minus molestiae laboriosam dignissimos atque eius modi, harum reprehenderit dolorum, ipsa, voluptas veniam non nulla ea, fugit hic officiis. Nisi, quis, eveniet!',
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
          <Title>
            <hl>Hillary Clinton</hl> & <hl>Emails</hl>
          </Title>
          <sub>
            2017 · Ongoing
          </sub>
        </mast>

        <feed>
          {feed.map(item => (
            <item key={Math.random()}>
              <Title if={item.title} size="20">
                {item.title} · <date>{item.date}</date>
              </Title>
              <pieces if={item.content}>
                {item.content.map(content => (
                  <Text $$content>
                    {content.text}
                  </Text>
                ))}
              </pieces>
            </item>
          ))}
        </feed>
      </Page>
    );
  }

  static style = {
    mast: {
      borderBottom: [1, '#f2f2f2'],
      padding: [20, 0],
    },
    sub: {
      textAlign: 'right',
      fontSize: 20,
      opacity: 0.5,
      marginTop: -10,
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
      borderBottom: [1, '#f2f2f2'],
      padding: [20, 0],
    }
  };
}

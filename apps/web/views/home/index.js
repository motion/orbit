import { view, glossy } from 'my-decorators'
import { Title, Page, Date } from 'my-views'
import feed from './data'

const Dot = glossy('dot', { margin: [0, 10] })
const DOT = <Dot>&middot;</Dot>

@view
export default class Home {
  render() {
    return (
      <Page>
        <feed>
          <Title if={false} $title size={18}>Feed</Title>
          {feed.map(item => (
            <item key={Math.random()}>
              <Title size={20} $$margin={0}>{item.title}</Title>
              <via $$row $$align="center">
                <Date>{item.date}</Date>
                {DOT}
                <a href=""><img src="https://stratechery.com/wp-content/themes/stratechery/images/StratecheryLogo-5757.png" /> Stratechery</a>
              </via>
              <content>
                {item.content}
              </content>
              <nav>
                <a href="">10 comments</a>
                {DOT}
                <a href="">5 topics</a>
              </nav>
            </item>
          ))}
        </feed>
      </Page>
    )
  }

  static style = {
    item: {
      padding: 10,
      marginBottom: 15,
    },
    feed: {
      width: '75%',
      padding: [20, 0],
    },
    title: {
      color: '#999',
      margin: [0, 10],
    },
    via: {
      fontSize: 13,
      margin: [0, 0, 5],
    },
    img: {
      width: 12,
      height: 12,
      marginRight: 5,
    },
    dot: {
      margin: [0, 10],
      color: '#999',
    },
    a: {
      display: 'flex',
      flexFlow: 'row',
      alignItems: 'center',
      fontWeight: 500,
      color: '#999'
    },
    nav: {
      flexFlow: 'row'
    }
  }
}

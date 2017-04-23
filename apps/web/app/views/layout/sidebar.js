import { view } from '~/helpers'
import { Page, Link, Input } from '~/views'
import { Place } from 'models'
import Login from './login'

class SidebarStore {
  places = Place.all()
}

@view({ store: SidebarStore })
export default class Sidebar {
  render({ store }) {
    return (
      <side>
        <Login />

        <h2>me</h2>
        <Link $piece onClick={() => Router.go('/')}>home</Link>

        <h2>groups</h2>
        <main if={store.places.current}>
          {store.places.current.map(piece => (
            <Link $piece to={piece.url()} key={piece._id}>
              {piece.title}
            </Link>
          ))}
        </main>
        <form onSubmit={store.createPlace}>
          <Input
            $create
            ref={ref => store.place = ref}
            placeholder="Create..."
          />
        </form>
      </side>
    )
  }

  static style = {
    side: {
      width: 210,
      padding: [0, 10],
      borderLeft: [1, '#eee'],
    },
    main: {
      flex: 1,
    },
    h2: {
      fontSize: 14,
      color: [0, 0, 0, 0.5],
    },
    piece: {
      width: '100%',
      fontWeight: 700,
      fontSize: 16,
      color: 'purple',
      padding: [4, 8],
      cursor: 'pointer',
      '&:hover': {
        background: '#f2f2f2',
      },
    },
  }
}

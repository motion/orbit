import { view } from '~/helpers'
import { Page, Link, Input } from '~/views'
import { Place } from 'models'
import Login from './login'
import { SIDEBAR_WIDTH } from '~/constants'

class SidebarStore {
  places = Place.all()
  placeInput = null

  createPlace = e => {
    e.preventDefault()
    Place.create({ title: this.placeInput.value })
    this.placeInput.value = ''
  }
}

@view({ store: SidebarStore })
export default class Sidebar {
  render({ store }) {
    return (
      <side>
        <content $$undraggable>
          <Login />

          <h2>go</h2>
          <Link $piece onClick={() => Router.go('/')}>feed</Link>
          <Link $piece onClick={() => Router.go('/me')}>personal</Link>

          <h2>places</h2>
          <main if={store.places.current}>
            {store.places.current.map(piece => (
              <Link $piece to={piece.url()} key={piece._id}>
                {piece.title}
              </Link>
            ))}
          </main>
        </content>

        <div $$flex $$draggable />

        <sidebar if={App.views.sidebar}>
          {App.views.sidebar}
        </sidebar>

        <form onSubmit={store.createPlace}>
          <Input
            $create
            $$fontSize={18}
            getRef={ref => store.placeInput = ref}
            onKeyDown={e => e.which === 13 && store.createPlace(e)}
            placeholder="🎉 make new place..."
          />
        </form>
      </side>
    )
  }

  static style = {
    side: {
      width: SIDEBAR_WIDTH,
      borderLeft: [1, '#eee'],
    },
    main: {
      flex: 1,
    },
    h2: {
      fontSize: 14,
      fontWeight: 300,
      padding: [4, 8],
      color: [0, 0, 0, 0.5],
      borderBottom: [1, 'dotted', '#f2f2f2'],
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
    create: {
      width: '100%',
    },
  }
}

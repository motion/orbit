import { view } from '~/helpers'
import { Page, Link, Input } from '~/views'
import { Place } from 'models'
import Login from './login'
import { SIDEBAR_WIDTH } from '~/constants'

class SidebarStore {
  places = Place.all()
  placeInput = null

  createPlace = async e => {
    e.preventDefault()
    const val = this.placeInput.value
    await Place.createWithHome(val)
    this.placeInput.value = ''
  }
}

const SideBarLink = ({ children, after, ...props }) => (
  <Link
    {...props}
    $$style={{
      width: '100%',
      fontWeight: 400,
      fontSize: 18,
      color: 'purple',
      padding: [7, 10],
      cursor: 'pointer',
      '&:hover': {
        background: '#fafafa',
      },
    }}
    active={{
      background: '#fff',
      color: '#000',
      '&:hover': {
        background: '#fafafa',
      },
    }}
  >
    {children}
    <span $$fontSize={10} if={after}>
      {after}
    </span>
  </Link>
)

@view({ store: SidebarStore })
export default class Sidebar {
  render({ store }) {
    return (
      <side>
        <content $$undraggable>
          <Login />

          <h2>go</h2>
          <SideBarLink to="/">me</SideBarLink>
          <SideBarLink to="/feed">feed</SideBarLink>

          <h2>places</h2>
          <form onSubmit={store.createPlace}>
            <Input
              $create
              getRef={ref => (store.placeInput = ref)}
              onKeyDown={e => e.which === 13 && store.createPlace(e)}
              placeholder="new place"
            />
          </form>
          <main if={store.places}>
            {(store.places || []).map(place => {
              return (
                <SideBarLink to={place.url()} key={place._id}>
                  {place.title}
                </SideBarLink>
              )
            })}
          </main>
        </content>

        <div $$flex $$draggable />

        <sidebar if={App.views.sidebar}>
          {App.views.sidebar}
        </sidebar>
      </side>
    )
  }

  static style = {
    side: {
      width: SIDEBAR_WIDTH,
      borderLeft: [1, '#eee'],
      overflowY: 'scroll',
      overflowX: 'hidden',
      userSelect: 'none',
    },
    main: {
      flex: 1,
    },
    h2: {
      fontSize: 14,
      fontWeight: 300,
      padding: [4, 8, 0],
      color: [0, 0, 0, 0.5],
    },
    create: {
      background: '#eee',
      color: '#000',
      border: 'none',
      margin: [5, 5, 10, 5],
      padding: 8,
      fontSize: 16,
    },
  }
}

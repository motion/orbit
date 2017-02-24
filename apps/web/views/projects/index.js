import { view, provide } from 'helpers'
import { Title, Text, Page, Link } from 'views'
import { Hero } from 'models'

@view
@provide({
  store: class {
    x = 2
    heroes = Hero.byName()
    insert(name, color) {
      Hero.table.insert({ name, color })
    }
  }
})
export default class Projects {
  render({ store }) {
    return (
      <Page>
        <Title>{store.x} 2</Title>
        <button onClick={() => store.x++}>increment</button>
        {(store.heroes.current || []).map(hero =>
          <hero key={Math.random()}>
            {hero.name || 'none'} {hero.color || 'none'}
          </hero>
        )}
        name <input ref={x => this.name = x} />
        color <input ref={x => this.color = x} />
        <button onClick={() => store.insert(this.name.value, this.color.value)}>insert hero</button>
      </Page>
    )
  }
}


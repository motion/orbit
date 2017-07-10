// @flow
import React from 'react'
import { view } from '@mcro/black'
import * as UI from '@mcro/ui'

@view
class Playground {
  render() {
    return (
      <playground>
        <section $buttons>
          <row $$row>
            <UI.Button icon="world">Hello World</UI.Button>
            <UI.Button icon="world" size={2}>
              Hello World
            </UI.Button>
            <UI.Button color="red" background="blue">
              Hello World
            </UI.Button>
            <UI.Button circular>Hello World</UI.Button>
            <UI.Button circular size={3}>
              Hello World
            </UI.Button>
          </row>

          <row $$row>
            <UI.Segment>
              <UI.Button icon="world">Hello World</UI.Button>
              <UI.Button icon="world">Hello World</UI.Button>
              <UI.Button icon="world">Hello World</UI.Button>
            </UI.Segment>

            <UI.Segment>
              <UI.Button circular icon="eye" />
              <UI.Button circular icon="eye" />
              <UI.Button circular icon="eye" />
            </UI.Segment>

            <UI.Segment>
              <UI.Button circular icon="eye" />
              <UI.Button circular icon="eye" />
              <UI.Button circular icon="eye" />
            </UI.Segment>
          </row>
        </section>

        <section $form>
          <row $$row>
            <UI.Input icon="world" placeholder="you" />
            <UI.Input icon="world" size={2} />
            <UI.Input placeholder="hello" />
          </row>
        </section>
      </playground>
    )
  }

  static style = {
    row: {
      padding: [20, 0],
    },
  }
}

@view
export default class InterfacePlayground {
  render() {
    return (
      <main>
        <UI.Popover target={<UI.Button>test</UI.Button>}>
          <is>open</is>
        </UI.Popover>

        <UI.Drawer if={false} from="right" open>
          test stuff
        </UI.Drawer>

        <UI.Theme if={true} name="dark">
          <UI.Button circular icon="eye" onClick={() => alert('hi')} />
        </UI.Theme>
        <ok if={true}>
          <Playground />
          <UI.Theme name="light">
            <Playground />
          </UI.Theme>
          <UI.Theme name="dark">
            <Playground />
          </UI.Theme>
        </ok>
      </main>
    )
  }
}

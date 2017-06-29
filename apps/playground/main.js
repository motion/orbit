// @flow
import React from 'react'
import { view } from '@mcro/black'
import * as Z from '@mcro/ui'

@view
class Playground {
  render() {
    return (
      <playground>
        <section $buttons>
          <row $$row>
            <Z.Button test icon="world">Hello World</Z.Button>
            <Z.Button test icon="world" size={2}>Hello World</Z.Button>
            <Z.Button test color="red" background="blue">Hello World</Z.Button>
            <Z.Button test circular>Hello World</Z.Button>
            <Z.Button test circular size={3}>Hello World</Z.Button>
          </row>

          <row $$row>
            <Z.Segment>
              <Z.Button icon="world">Hello World</Z.Button>
              <Z.Button icon="world">Hello World</Z.Button>
              <Z.Button icon="world">Hello World</Z.Button>
            </Z.Segment>

            <Z.Segment>
              <Z.Button circular icon="eye" />
              <Z.Button circular icon="eye" />
              <Z.Button circular icon="eye" />
            </Z.Segment>

            <Z.Segment>
              <Z.Button circular icon="eye" />
              <Z.Button circular icon="eye" />
              <Z.Button circular icon="eye" />
            </Z.Segment>
          </row>
        </section>

        <section $form>
          <row $$row>
            <Z.Input icon="world" placeholder="you" />
            <Z.Input icon="world" size={2} />
            <Z.Input placeholder="hello" />
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
export default class Main {
  render() {
    return (
      <main>
        <Z.Drawer if={false} from="right" open>
          test stuff
        </Z.Drawer>

        <Z.Theme if={true} name="dark">
            <Z.Button circular icon="eye" onClick={() => alert('hi')} />
          </Z.Theme>
        <ok if={false}>
          <Playground />
          <Z.Theme name="light">
            <Playground />
          </Z.Theme>
          <Z.Theme name="dark">
            <Playground />
          </Z.Theme>
        </ok>
      </main>
    )
  }
}

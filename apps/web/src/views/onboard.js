// @flow
import React from 'react'
import { view } from '@mcro/black'
import {
  Theme,
  Form,
  Field,
  TiltGlow,
  Grain,
  Glint,
  Drawer,
  Segment,
  Button,
  PassProps,
} from '@mcro/ui'
import { User } from '@mcro/models'
import Page from '~/views/page'

// TODO
// IDEA
// <PassProps theme={['row', 'serif', 'chromeless']}>

@view({
  store: class OnboardStore {
    get show() {
      return true //!User.org
    }

    step = 0

    setStep = (val: number) => {
      this.step = val
    }
  },
})
export default class OnboardPage {
  render({ store }) {
    return (
      <fml $$fullscreen $$draggable>
        <Theme name="dark">
          <modal>
            <Form>
              <PassProps row chromeless placeholderColor="#333">
                <Field label="Name" placeholder="something" />
                <Field label="Email" placeholder="something" />
                <Field label="Password" placeholder="something" />
              </PassProps>
            </Form>
            <Button>Next</Button>
          </modal>
        </Theme>
      </fml>
    )
  }

  static style = {
    fml: {
      background: 'rgba(0,0,0,0.1)',
      backdropFilter: 'blur(0.8px)',
      zIndex: 10000,
      alignItems: 'flex-end',
      justifyContent: 'center',
    },
    modal: {
      padding: 80,
      background: '#000',
      height: '100%',
      borderRadius: 5,
      color: '#fff',
    },
  }
}

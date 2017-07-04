// @flow
import * as MobxHelpers from 'motion-mobx-helpers'
import * as Helpers from '@mcro/helpers'

export default () => ({
  name: 'helpers',
  mixin: {
    ...Helpers,
    ...MobxHelpers,
  },
})

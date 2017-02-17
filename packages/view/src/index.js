import mixin from 'react-mixin'
import ClassHelpers from 'motion-class-helpers'

export default Component => mixin.onClass(Component, {
  ...ClassHelpers,
  test() {
    console.log('it works!')
  }
})

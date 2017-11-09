import jssNested from 'jss-nested'
import jssDefaultUnit from 'jss-default-unit'
import jssPropsSort from 'jss-props-sort'
import * as JSS from 'jss'

const jss = JSS.create()

function specific() {
  return {
    onProcessRule(rule) {
      console.log('rule is', rule.selector, rule)
      // rule.selector = ` body ${rule.selector}`
    },
  }
}

jss.use(jssNested(), jssDefaultUnit(), jssPropsSort(), specific())

export default jss

window.JSS = jss

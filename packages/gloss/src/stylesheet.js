import jssNested from 'jss-nested'
import jssDefaultUnit from 'jss-default-unit'
import jssPropsSort from 'jss-props-sort'
import jssIsolate from 'jss-isolate'
import * as JSS from 'jss'

const jss = JSS.create()

jss.use(
  jssNested(),
  jssDefaultUnit(),
  jssPropsSort(),
  jssIsolate({ isolate: false })
)

export default jss

window.JSS = jss

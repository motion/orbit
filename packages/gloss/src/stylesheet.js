import jssNested from 'jss-nested'
import jssDefaultUnit from 'jss-default-unit'
import jssPropsSort from 'jss-props-sort'
import * as JSS from 'jss'

const jss = JSS.create()

jss.use(jssNested(), jssDefaultUnit(), jssPropsSort())

export default jss

window.JSS = jss

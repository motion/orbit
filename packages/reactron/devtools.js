const {
  EMBER_INSPECTOR,
  REACT_DEVELOPER_TOOLS,
  BACKBONE_DEBUGGER,
  JQUERY_DEBUGGER,
  ANGULARJS_BATARANG,
  VUEJS_DEVTOOLS,
  REDUX_DEVTOOLS,
  REACT_PERF,
  CYCLEJS_DEVTOOL,
  MOBX_DEVTOOLS,
  APOLLO_DEVELOPER_TOOLS,
} = require('electron-devtools-installer')

module.exports = {
  ember: EMBER_INSPECTOR,
  vuejs: VUEJS_DEVTOOLS,
  redux: REDUX_DEVTOOLS,
  react: REACT_DEVELOPER_TOOLS,
  mobx: MOBX_DEVTOOLS,
  apollo: APOLLO_DEVELOPER_TOOLS,
  cycle: CYCLEJS_DEVTOOL,
  reactPerf: REACT_PERF,
  jquery: JQUERY_DEBUGGER,
  backbone: BACKBONE_DEBUGGER,
  angular: ANGULARJS_BATARANG,
}

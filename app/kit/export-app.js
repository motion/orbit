// used by the cli to make easy to parse appEntry.js
// see cli command-build

exports.createApp = function(x) {
  return x
}
exports.createApi = function(x) {
  return x
}

// TODO tenative can we put a proxy around exports in case they use other things in entry?

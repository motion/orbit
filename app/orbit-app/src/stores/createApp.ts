const state = {
  showCreateNew: false,
}

const actions = {
  setShowCreateNew({ state, value }) {
    state.showCreateNew = value
  },
}

export const createApp = {
  state,
  actions,
  // effects,
}

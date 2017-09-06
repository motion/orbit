// @flow

declare var module: {
  hot: {
    accept(path: string | (() => void), callback?: () => void): any,
  },
}

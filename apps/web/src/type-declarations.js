// @flow

declare var module: {
  hot: {
    accept(path: string | (() => void), callback?: () => void): void,
  },
}

declare var log: (...args: any) => void

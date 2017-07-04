// @flow

export type Helpers = {
  on(target: any, name: string, callback: Function): { dispose(): void },
  setInterval(callback: Function): Function,
  setTimeout(callback: Function): Function,
  ref(path: string): { setter: Function, set: Function, toggle: Function },
  watch(callback: Function): { dispose(): void },
  react(watch: Function, callback: Function): { dispose(): void },
}

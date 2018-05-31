import { DecorPlugin } from '@mcro/decor'

export interface UtilityUsableClass {
  ref(
    name: string,
  ): {
    set(a: any): void
    get(a: any): void
  }
  on(a: Object | string, b: Function | string, c?: Function): void
  setTimeout(a: Function, b?: number): void
  setInterval(a: Function, b?: number): void
}

export type UtilityUsable = DecorPlugin<UtilityUsableClass>

export function utilityUsable(a: any, b: any): any
export function hydratable(a: any, b: any): any
export function reactObservable(a: any, b: any): any

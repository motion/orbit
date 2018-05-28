export interface UtilityUsable {
  ref(a: string): Function
  on(a: string, b: Function): void
  setInterval(a: Function, b?: number): void
  setTimeout(a: Function, b?: number): void
}

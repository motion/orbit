interface DOMRectReadOnly {
  readonly x: number
  readonly y: number
  readonly width: number
  readonly height: number
  readonly top: number
  readonly right: number
  readonly bottom: number
  readonly left: number
}
export interface ResizeObserverCallback {
  (entries: ResizeObserverEntry[], observer: ResizeObserver): void
}
interface ResizeObserverEntry {
  readonly target: Element
  readonly contentRect: DOMRectReadOnly
}
interface ResizeObserver {
  observe(target: Element): void
  unobserve(target: Element): void
  disconnect(): void
}
interface ResizeObserverPolyfill {
  prototype: ResizeObserver
  new (callback: ResizeObserverCallback): ResizeObserver
}

export const ResizeObserver =
  typeof window !== 'undefined' ? (window['ResizeObserver'] as ResizeObserverPolyfill) : null

export const ResizeObserver =
  typeof window !== 'undefined' ? (window['ResizeObserver'] as ResizeObserver) : null

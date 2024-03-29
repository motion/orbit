declare const electronRequire: (a: string) => any

declare module '*.svg' {
  const content: any
  export default content
}

declare module '*.png' {
  const content: any
  export default content
}

// Nate's secret function for global logging
declare function log(...args: any[])

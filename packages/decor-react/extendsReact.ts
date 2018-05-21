import * as React from 'react'

export type ExtendsReact = React.Component<any, any>

export function extendsReact() {
  return {
    name: 'extends-react',
    once: true,
    onlyClass: true,
    decorator: (Klass: Function) => {
      if (!Klass.prototype.isReactComponent) {
        Object.setPrototypeOf(Klass.prototype, React.Component.prototype)
      }
    },
  }
}

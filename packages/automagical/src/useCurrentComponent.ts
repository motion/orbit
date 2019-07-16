// @ts-ignore
import { __SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED } from 'react'

const { ReactCurrentOwner } = __SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED

export interface CurrentComponent {
  (): any
  renderName: string
  renderId: number
  __debug?: boolean
}

export function useCurrentComponent(): CurrentComponent {
  const component =
    ReactCurrentOwner && ReactCurrentOwner.current && ReactCurrentOwner.current.elementType
      ? ReactCurrentOwner.current.elementType
      : {}
  component['renderName'] = component['renderName'] || getComponentName(component)
  return component
}

function getComponentName(c: any) {
  let name = c.displayName || (c.type && c.type.displayName) || (c.render && c.render.name)
  if (c.displayName === '_default') {
    name = c.type && (c.type.displayName || c.type.name)
  }
  if (name === 'Component' || name === '_default' || !name) {
    if (c.type && c.type.__reactstandin__key) {
      const match = c.type.__reactstandin__key.match(/\#[a-zA-Z0-9_-]+/g)
      if (match && match.length) {
        name = match[0].slice(1)
      }
    }
  }
  if (name === '_default' || !name) {
    const m = `${c}`.match(/function ([a-z0-9_]+)\(/i)
    if (m) name = m[1]
  }
  return name
}

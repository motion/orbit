import { DecorPlugin } from '@mcro/decor'
import { Subscribable } from './subscribable'
import { Emittable } from './emittable'

export function subscribable(): DecorPlugin<Subscribable>
export function emittable(): DecorPlugin<Emittable>

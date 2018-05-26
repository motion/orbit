import { DecorCompiledDecorator } from '@mcro/decor'
import { StoreProvidable } from '@mcro/decor-react'

export { DecorCompiledDecorator } from '@mcro/decor'

export type DecorView = DecorCompiledDecorator<any>

export function view(a: any): DecorCompiledDecorator<StoreProvidable>

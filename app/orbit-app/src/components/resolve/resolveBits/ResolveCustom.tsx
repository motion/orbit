import { BitItemResolverProps } from '../ResolveBit'

export const ResolveCustom = ({ bit, children }: BitItemResolverProps) =>
  children({
    id: `${bit.id}`,
    type: 'bit',
    title: bit.title,
    icon: bit.integration,
    webLink: bit.webLink,
    desktopLink: bit.webLink,
    content: bit.body,
    preview: bit.body,
  })

import { BitItemResolverProps } from '../ResolveBit'

export const ResolveWebsite = ({ bit, children }: BitItemResolverProps) =>
  children({
    id: `${bit.id}`,
    type: 'bit',
    title: bit.title,
    icon: bit.integration,
    location: bit.location.name || '',
    locationLink: bit.location.desktopLink || bit.location.webLink,
    webLink: bit.webLink,
    desktopLink: bit.webLink,
    content: bit.body,
  })

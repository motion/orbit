import { GithubBitData, GithubBitDataComment } from '@mcro/models'
import * as UI from '@mcro/ui'
import * as React from 'react'
import { DateFormat } from '../../../views/DateFormat'
import { BitItemResolverProps } from '../ResolveBit'
import { Markdown } from '../../../views/Markdown'
import { VerticalSpace, HorizontalSpace } from '../../../views'
import { RoundButtonBorderedSmall } from '../../../views/RoundButtonBordered'
import { Text, Icon } from '@mcro/ui'
import { Actions } from '../../../actions/Actions'
import { handleClickPerson } from '../../../views/RoundButtonPerson'

export const ResolveTask = ({
  bit,
  children,
  isExpanded,
  shownLimit,
  extraProps,
}: BitItemResolverProps) => {
  return children({
    id: `${bit.id}`,
    type: 'bit',
    title: bit.title,
    icon: 'github',
    locationLink: bit.location.webLink,
    location: bit.location.name,
    webLink: bit.webLink,
    people: bit.people,
    content,
    comments,
  })
}

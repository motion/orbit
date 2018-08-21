import * as Helpers from '../../../helpers'
import keywordExtract from '@mcro/keyword-extract'
import * as _ from 'lodash'
import { ItemResolverProps } from '../../ItemResolver'

const options = {
  remove_digits: true,
  return_changed_case: true,
  remove_duplicates: false,
}

export const ResolveMail = ({ bit, children }: ItemResolverProps) =>
  children({
    title: keywordExtract
      .extract(bit.title, options)
      .slice(0, 4)
      .map(_.capitalize)
      .join(' '),
    icon: 'gmail',
    webLink: bit.webLink,
    desktopLink: bit.desktopLink,
    location: Helpers.getHeaderFromShort(bit),
    locationLink: bit.location.webLink,
    content: bit.body,
    preview: keywordExtract
      .extract(bit.body, options)
      .slice(0, 6)
      .join(' '),
  })

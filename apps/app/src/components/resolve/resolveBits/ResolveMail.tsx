import * as Helpers from '../../../helpers'
import keywordExtract from '@mcro/keyword-extract'
import * as _ from 'lodash'
import { ItemResolverProps } from '../../ItemResolver'

const options = {
  remove_digits: true,
  return_changed_case: true,
  remove_duplicates: false,
}

export const ResolveMail = ({ bit, appStore, children }: ItemResolverProps) =>
  children({
    title: keywordExtract
      .extract(bit.title, options)
      .slice(0, 4)
      .map(_.capitalize)
      .join(' '),
    icon: 'gmail',
    permalink: () => appStore.open(bit),
    location: Helpers.getHeaderFromShort(bit),
    locationLink: () => {},
    date: Date.now(),
    content: bit.body,
    preview: keywordExtract
      .extract(bit.body, options)
      .slice(0, 6)
      .join(' '),
  })
